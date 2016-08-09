// *** Home Route ***
Router.route('/', {
  template: 'activeGames',
  layoutTemplate: 'homeLayout',
  controller: 'authenticatedController',
  waitOn: function() {
    return [
      Meteor.subscribe('activeGames'),
      Meteor.subscribe('teams')
    ]
  },
  data: function () {
    return {
      game: Games.find().fetch()
    }
  },
  onBeforeAction: function() {
    return this.next();
  }
});
