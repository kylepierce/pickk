Template.submitButton.helpers({
  'live': function() {
    var connection = Meteor.status()
    var status = connection.status

    if (status == "connected") {
      return true
    } else {
      return false
    }
  },
  'potential': function (){
    var multiplier = this.o.multiplier
    if(this.t === "prediction"){
      var wager = 5
      var winnings = parseInt(wager * multiplier)
      return winnings + " diamonds"
    } else {
      var wager = this.w
      var winnings = parseInt(wager * multiplier)
      return winnings
    }
  }
});

Template.submitButton.events({
  "click [data-action='submit']": function (e, t) {
    e.preventDefault()
    var userId = Meteor.userId()
    var o = this.o // option
    var q = this.q // question
    var t = this.t // type

    // a is for answer object
    var a = {
      userId: userId,
      gameId: q.gameId,
      questionId: q._id,
      period: q.period,
      type: t,
      answered: o.option,
      multiplier: o.multiplier,
      description: o.title
    }

    // Track what types of questions people are answering
    if(o.multiplier < 2.5){
      var multiplierRange = "low"
    } else if (o.multiplier < 4.5){
      var multiplierRange = "med"
    } else if (o.multiplier < 10){
      var multiplierRange = "high"
    } else if (o.multiplier < 99){
      var multiplierRange = "game changer"
    }

    if ( t === "free-pickk" ){
      var w = this.w // wager
      a.wager = w
    } else if ( t === "prediction" ){
      var w = "diamonds" // wager
      var gamePlayed = {
        userId: userId,
        gameId: q.gameId,
        type: "diamonds",
      }
      Meteor.call('userJoinsAGame', gamePlayed);

    } else {
      var w = this.w // wager
      // Normal Questions (i.e live, at bat, and drive)
      var selector = {userId: userId, gameId: q.gameId, period: q.period}
      var userCoins = GamePlayed.find(selector).fetch();
      var hasEnoughCoins = userCoins[0].coins >= w

      // Make sure the user has enough coins
      if (!hasEnoughCoins) {
        analytics.track("no coins", {
          id: a.userId,
          answered: a.answered,
          type: a.type,
          gameId: a.gameId,
          multiplier: o.multiplier,
          multiplierRange: multiplierRange,
          wager: w,
          userCoins: userCoins
        });

        IonLoading.show({
          customTemplate: '<h3>Not enough coins :(</h3><p>Lower the amount or or wait until the commercial for free pickks!</p>',
          duration: 1500,
          backdrop: true
        });
        return

      } else {
        // If they do add the wager to the answer object and set the last wager to whatever they predicted.
        a.wager = w
        Session.set('lastWager', w);
      }
    }

    // Remove the question from screen
    $(".single-question").removeClass("slideInLeft")
    $(".single-question").addClass("slideOutRight")

    analytics.track("question answered", {
      id: a.userId,
      answered: a.answered,
      period: a.period,
      type: a.type,
      gameId: a.gameId,
      multiplier: o.multiplier,
      multiplierRange: multiplierRange,
      wager: w,
    });

    if(Meteor.isCordova){
      //Intercom needs unix time with '_at' in JSON to work.
      var intercomData = {
        "last_question_answered_at": parseInt(Date.now() / 1000),
        "userId": a.userId,
      }
      updateIntercom(intercomData)
    }

    var obj = {lastQuestion: new Date()}
    analytics.identify(a.userId, obj)

    var countdown = new ReactiveCountdown(250);
    countdown.start(function() {
      Meteor.call('playerInactive', a.userId, a.questionId);
    });

    setTimeout(function() {
      Meteor.call('questionAnswered', a);
    }, 250);
  }
});
