Template.diamondWatcher.helpers({
	d: function() {
		var $game = Router.current().params._id
		var period = parseInt(Router.current().params.period)
		var userId = Meteor.userId()
		var currentQue = GamePlayed.findOne({userId: userId, gameId: $game, period: period}).queCounter
		var activityExchange = [0, 1, 3, 8, 15, 30, 45, 60, 75, 100, 125, 150]
		var value = {"0": 0,
		"1": 1, "3": 2, "8": 3, "15": 4, "30": 5, "45": 6, "60": 7, "75": 8, "100": 9, "125": 12, "150": 14,
		} 

		for (var i = activityExchange.length - 1; i >= 0; i--) {
			var bottom = activityExchange[i]
			var math = bottom - currentQue
			if (math <= 0){
				var top = activityExchange[i + 1]
				var percentage = parseInt(((currentQue - bottom) / (top-bottom)) * 100)
				var indexOfTop = top.toString()
				var prize = value[top]
				break;
			} 
		}
		var data = {
			bottom: bottom,
			top: top,
			percentage: percentage,
			currentQue: currentQue,
			prize: prize
		}
		return data
	},
	smallPercentage: function(percentage, binary){
		if (percentage <= 20 && binary === true){
			return true
		} else if(percentage > 20 && binary === false){
			return true
		} else {
			return false
		}
	}
});