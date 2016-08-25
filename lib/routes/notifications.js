Router.route('/notifications', {
  waitOn: function() {
    // var currentUser = Meteor.userId();
    return [
      Meteor.subscribe('unreadNotifications'),
      Meteor.subscribe('trophy')
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