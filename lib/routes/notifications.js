Router.route('/notifications', {
  // layoutTemplate: "notificationLayout",
  waitOn: function() {
    var currentUser = Meteor.userId();
    return [
      Meteor.subscribe('trophy'),
      Meteor.subscribe('userNotificationSettings')
    ]
  },
  data: function () {
    var userId = Meteor.userId();
    var user = Meteor.user();
    return {
      notifications: Notifications.find({userId: userId}).fetch(),
      user: user
    }
  },
  yieldRegions: {
    'notificationFilter': {to: 'filter'}
  },
  onBeforeAction: function () {
    return this.next()
  }
});
