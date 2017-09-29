// *** Home Route ***
Router.route('/', {
  name: "home",
  template: 'home',
  layoutTemplate: 'homeLayout',
});

Router.route('/prizes', {
  template: 'prizes',
  layoutTemplate: 'homeLayout'
});
