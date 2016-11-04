// *** Home Route ***
Router.route('/', {
  template: 'home',
  layoutTemplate: 'homeLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('activeHero'),
      Meteor.subscribe('dailyPickks')
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
});
