// *** Home Route ***
Router.route('/', {
  template: 'home',
  layoutTemplate: 'homeLayout',
  waitOn: function() {
    return [
      // Meteor.subscribe('dailyPickks'),
      Meteor.subscribe('liveGames'),
      Meteor.subscribe('upcomingGames')
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
  waitOn: function() {
    return [
      Meteor.subscribe('prizes')
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
