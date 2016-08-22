createPendingNotification = function(o) {
  // Basic arguments
  var obj = {
    dateCreated: new Date(),
    type: o.type,
    userId: o.userId, // Recieving
    read: false, 
  }

  // Optional arguments
  var optional = ["message", "notificationId", "questionId", "senderId", "trophyId", "badgeId", "gameId", "tournamentId", "groupId", "matchId", "messageId", "value", "shareMessage", "sharable", "reaction", "source", "gameName"]

  // If those optional arguments exist append to object
  for (var i = 0; i < optional.length; i++) {
    var name = optional[i]
    var keyIncluded = o[name]
    if (keyIncluded){
      obj[name] = o[name]
    }
  }

  // Create the notification in the collection
  Notifications.insert(obj);
};

Meteor.methods({

  'notifyTrophyAwarded': function(a) {
    check(a, Object);

    if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
    }

    if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
    }

    createPendingNotification(a)
  },

  'removeNotification': function(notifyId) {
    check(notifyId, String);
    Notifications.update({_id: notifyId}, {$set: {read: true}})
  },
})