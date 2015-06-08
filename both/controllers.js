AppController = RouteController.extend({
  layoutTemplate: 'mainView'
});

ProfileController = AppController.extend({
  waitOn: function () {
    if (Meteor.userId()) {
      return Meteor.subscribe('user', Meteor.userId());
    }
  },
  data: function () {
    if (Meteor.userId()) {
      return {
        user: Meteor.user()
      }
    }
  }
});