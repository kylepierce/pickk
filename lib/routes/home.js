// *** Home Route ***
Router.route('/', {
  template: 'activeGames',
  layoutTemplate: 'homeLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('activeGames'),
      Meteor.subscribe('teams'),
      Meteor.subscribe('activeHero')
    ]
  },
  data: function () {
    return {
      game: Games.find().fetch(),
      hero: Hero.find().fetch()
    }
  },
  onBeforeAction: function() {
    return this.next();
  }
});
