Meteor.publish("userNotificationSettings", function() {
	this.unblock()
  return UserList.find(this.userId,
    {
      fields: {
				'gameFilter': 1,
        'notifications': 1,
        'pendingNotifications': 1
      },
    limit: 25});
});

Meteor.publish('userNotifications', function(filters) {
	check(filters, Object)
  this.unblock()
	var userId = this.userId
	var type = filters.type
	var status = filters.status
	var user = UserList.find({_id: userId}).fetch()
	var existing = user[0].profile.notifications
	if (!existing){
		var existing = []
	}
  return Notifications.find({userId: userId, read: {$in: status}, type: {$in: type}}, {sort: {dateCreated: -1}, limit: 25})
});

Meteor.publish('gameNotifications', function(gameId) {
  check(gameId, String);
  var userId = this.userId;
  var notif = Notifications.find({gameId: gameId, userId: userId, read: false});
  return notif
});
