Template.history.onCreated(function(){
	var limit = Session.get('gameHistoryLength');
	if(!limit){Session.set("gameHistoryLength", 10)}
	var self = this
	self.getFilter = function () {
		return Session.get('gameHistoryLength');
	};
	
	self.autorun(function () {
		self.subscribe('gamesPlayed', self.getFilter(), function(){
			$("#load-more-games").each(function(){
				var t = $(this);
				setTimeout(function () {
					t.removeClass('hidden')
					t.addClass('animated fadeInUp');
				}, 750);
			});
			
			$('div.hidden').each(function (i) {
				var t = $(this);
				setTimeout(function () {
					t.removeClass('hidden')
					t.addClass('animated fadeInUp');
				}, (i + 1) * 70);
			});
		});
	});
});

Template.history.events({
	'click .item': function(){
		analytics.track('Click Single Game History', {
			gameId: this.id
		});
		Router.go('/history/' + this.id);
	},
	'click [data-action=increaseCount]': function(){
		var limit = Session.get('gameHistoryLength');
		analytics.track('Click "Load More"', {
			location: "History"
		});
		$("#load-more-games").each(function () {
			var t = $(this);
			t.addClass('hidden');
			setTimeout(function () {
				t.removeClass('hidden')
				t.addClass('animated fadeInUp');
			}, 750);
		});
		Session.set("gameHistoryLength", limit + 10)
	}
});

Template.history.helpers({
	gamesPlayed: function () {
		return Games.find({});
	},
	noGamesPlayed: function(){
		var count = Games.find().count()
		if (count === 0) {
			return true
		}
	}
});
