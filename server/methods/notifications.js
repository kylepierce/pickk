createPendingNotification = function(o) {
  o.dateCreated = new Date()
  o.read = false

  // Create the notification in the collection
  Notifications.insert(o);
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
    this.unblock()
    Notifications.update({_id: notifyId}, {$set: {read: true}})
  },
  'questionData': function (id) {
    check(id, String);
    
    return question.que
  },
  'deleteScore': function (){
    Notifications.update({type: "score"}, {$set: {read: true}})
  }
})