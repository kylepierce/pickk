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
	active: function(){
		if (this.game.status === "In-Progress"){
			return true
		}
	},
	sport: function(sport){
		if (this.game.sport === sport){
			return true
		}
	}
});

Template.footballInfoCard.helpers({
	downAndDistance: function(){
		if (this.game.downAndDistance === "Point After Attempt"){
			return "PAT"
		} else {
			return this.game.downAndDistance
		}
	},
	location: function(){
		return "@" + this.game.location
	},
	quarter: function(){
		return this.game.quarter
	},
	time: function(){
		return this.game.time
	},
	ballLocation: function(){
		var distance = this.game.distanceToTouchdown
		var marker = distance
		if (this.game.whoHasBall === this.game.home_team){
			if (distance > 50){
				var over = distance - 50
				var marker = 50 - over
			}
		}
		return marker + "%"
	},
	yardsToGo: function(){
		if (this.game.whoHasBall === this.game.away_team){
			var sign = "-"
		} else {
			var sign = ""
		}
		return sign + this.game.distanceToFirstDown + "%"
	},
	team: function(num) {
		var statsTeamId = this.game.teams[num].teamId
		var team = Teams.findOne({"statsTeamId": statsTeamId});
		if(this.game.whoHasBall === statsTeamId){
			team.hasBall = true
		}
		return team
	},
	shortCode: function() {
		return this.computerName.toUpperCase()
	},
	hexColor: function(){
		if(!this.hasBall){
			return "grey"
		} else {
			return "#" + this.hex[0]
		}
	}
});
