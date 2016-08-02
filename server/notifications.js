createPendingNotification = function(userId, notificationId, type, message) {
  Meteor.users.update(userId,
    {
      $push: {
        pendingNotifications: {
          _id: Random.id(),
          type: type,
          read: false,
          notificationId: notificationId,
          dateCreated: new Date(),
          message: message
        }
      }
    }
  );
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