// *** Home Route ***
Router.route('/home', {
  template: 'home',
  layoutTemplate: 'homeLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('activeHero'),
      Meteor.subscribe('dailyPickks'),
      Meteor.subscribe('liveGames')
    ]
  },
  data: function () {
    return {
      hero: Hero.find().fetch(),
      games: Games.find().fetch()
    }
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/prizes', {
  template: 'prizes',
  layoutTemplate: 'homeLayout',
});
