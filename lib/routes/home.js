// *** Home Route ***
Router.route('/', {
  name: "home",
  template: 'home',
  waitOn: function () {
    return [
      Meteor.subscribe('sectionHeros', ['home']),
    ]
  },
  onBeforeAction: function () {
    return this.next();
  }
});

Router.route('/prizes', {
  template: 'prizes',
});
