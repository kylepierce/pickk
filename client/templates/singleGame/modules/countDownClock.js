Template.countDownClock.helpers({
	countdown: function (dateCreated){
    var timeLimit = GamePlayed.findOne().timeLimit
    var finish = Chronos.moment().subtract(timeLimit, "seconds")
    var dateCreated = moment(dateCreated)
    var clock = dateCreated.diff(finish, "seconds")
    return clock
  },
  reduce: function (dateCreated) {
  	var timeLimit = GamePlayed.findOne().timeLimit
    var finish = Chronos.moment().subtract(timeLimit, "seconds")
    var dateCreated = moment(dateCreated)
    var clock = dateCreated.diff(finish, "seconds")
    var percentage = clock / timeLimit
    var reduction = 157.0796 * percentage
    return reduction
  	// If its full it would be 0
  	// If its empty it would be 255
  	// Each second should increase by (255/time)
  },
  alert: function (dateCreated) {
  	var timeLimit = GamePlayed.findOne().timeLimit
    var finish = Chronos.moment().subtract(timeLimit, "seconds")
    var dateCreated = moment(dateCreated)
    var clock = dateCreated.diff(finish, "seconds")
    var percentage = clock / timeLimit
    if (percentage > 0.25){
    	return "green"
    } else {
    	return "red"
    }
  }
});