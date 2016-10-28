Router.route('/daily-pickks', {
  name: 'dailyPickks',
  template: 'dailyPickks',
  
  waitOn: function() {

    return [
      Meteor.subscribe('dailyPickks'),
      Meteor.subscribe('predictionGames')
    ]
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