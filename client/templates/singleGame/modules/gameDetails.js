Template.notificationCenter.rendered = function () {
	$('#notification-center').slick({
		arrows: false,
		infinite: false,
		draggable: true,
		centerMode: true,
		centerPadding: '10px'
	});
	$.each($(".complete-game-card"), function(i, el){
		setTimeout(function(){
			$(el).css("opacity","1");
			$(el).addClass("fadeInLeft","400");
		}, 100 + ( i * 100 ));
	});
}

Template.notificationCenter.helpers({
  game: function(){
    return Games.findOne();
  },
	sport: function(sport){
		if (this.game.sport === sport){
			return true
		}
	}
});

Template.footballInfoCard.helpers({
	down: function(){
		if (this.game.eventStatus){
			var down = parseInt(this.game.eventStatus.down);
			switch (down) {
				case 1:
					var down = down + "st"
					break;
				case 2:
					var down = down + "nd"
					break;
				case 3:
					var down = down + "rd"
					break;
				case 4:
					var down = down + "th"
					break;
				default:
					var down = "---"
					break;
			}
			return down
		}
	},
	distance: function(){
		return this.game.eventStatus.distance
	},
	location: function(){
		return "@" + this.game.location
	},
	quarter: function(){
		var period = this.game.eventStatus.period
		switch (period) {
			case 1:
				var period = period + "st"
				break;
			case 2:
				var period = period + "nd"
				break;
			case 3:
				var period = period + "rd"
				break;
			default:
				var period = period + "th"
				break;
		}
		return period
	},
	time: function(){
		var seconds = this.game.eventStatus.seconds.toString()
		if (seconds && seconds.length < 2) {
			var seconds = "0" + seconds
		}
		return this.game.eventStatus.minutes + ":" + seconds
	},
	ballLocation: function(){
		return "70%"
	},
	yardsToGo: function(){
		return "10%"
	},
	away: function (){
		statsTeamId = this.game.teams[0].teamId
		Meteor.subscribe('singleTeam', statsTeamId);
		return Teams.findOne({"statsTeamId": statsTeamId});
	},
	home: function() {
		statsTeamId = this.game.teams[1].teamId
		Meteor.subscribe('singleTeam', statsTeamId);
		return Teams.findOne({"statsTeamId": statsTeamId});
	},
	shortCode: function() {
		return this.computerName.toUpperCase()
	},
	hexColor: function(){
		return "#" + this.hex[0]
	}
});
