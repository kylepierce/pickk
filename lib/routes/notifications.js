Router.route('/notifications', {
  layoutTemplate: "notificationLayout",
  waitOn: function() {
    // var currentUser = Meteor.userId();
    return [
      Meteor.subscribe('unreadNotifications'),
      Meteor.subscribe('trophy'),
      Meteor.subscribe('userNotificationSettings')
    ]
  }, 
  data: function () {
    var userId = Meteor.userId();
    return {
      notifications: Notifications.find({userId: userId}).fetch()
    }
  },
  onBeforeAction: function () {
    return this.next()
  }
});