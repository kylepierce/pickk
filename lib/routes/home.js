// *** Home Route ***
Router.route('/', {
  name: "home",
  template: 'home',
  layoutTemplate: 'homeLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('dailyPickks'),
      Meteor.subscribe("buttons", "home"),
      Meteor.subscribe('activeHero')
    ]
  },
  data: function () {
    return {
      hero: Hero.find().fetch()    
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
