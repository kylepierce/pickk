Router.route('/daily-pickks', {
  name: 'dailyPickks',
  template: 'dailyPickks',
  waitOn: function() {
    var subscribe = [
      Meteor.subscribe('dailyPickks'),
      Meteor.subscribe('predictionGames'),
    ]
    var game = Games.findOne({});
    if(game){
      subscribe.push(Meteor.subscribe('gamePlayed', game._id))
    }
    return subscribe
  },
  data: function () {
    return {
      questions: Questions.find().fetch()
    }
  },
  onBeforeAction: function ( ) {
    return this.next();
  }
});
