createPendingNotification = function(o) {
  // Basic arguments
  var obj = {
    dateCreated: new Date(),
    type: o.type,
    userId: o.userId, // Recieving
    read: false,
    message: o.message,   
    notificationId: o.notificationId,  
  }

  // Optional arguments
  var optional = ["senderId", "trophyId", "badgeId", "gameId", "tournamentId", "matchId", "value", "shareMessage", "sharable"]

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

  'notifyTrophyAwarded': function(trophyId, user) {
    check(trophyId, String);
    check(user, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error("not-signed-in", "Must be the logged in");
    }

    if (Meteor.user().profile.role !== "admin") {
      throw new Meteor.Error(403, "Unauthorized");
    }

    var timeCreated = new Date();
    var id = Random.id();
    UserList.update({_id: user},
      {
        $push: {
          pendingNotifications: {
            _id: id,
            type: "trophy",
            notificationId: trophyId,
            dateCreated: timeCreated
          }
        }
      }
    );
  },

  'removeNotification': function(notifyId) {
    check(notifyId, String);

    var user = Meteor.userId();
    UserList.update({_id: user},
      {
        $pull: {
          pendingNotifications: {_id: notifyId}
        }
      })
  },

  'readNotification': function(notifyId) {
    check(notifyId, String);

    var userId = Meteor.userId();
    UserList.update({_id: userId},
      {
        $pull: {
          pendingNotifications: {_id: notifyId}
        }
      })
  },
})