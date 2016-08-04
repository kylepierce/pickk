// Groups

Meteor.publish('singleGroup', function(groupId) {
  check(groupId, String);

  return Groups.find({_id: groupId});
});

// Find groups that userId belongs to
Meteor.publish('findUserGroups', function(userId) {
  check(userId, String);

  var selector = {"profile.groups": id}
  var fields = {
    'profile.username': 1,
    'profile.avatar': 1,
    '_id': 1
  }

  return UserList.find(selector, {fields: fields});

});

// Users of a specific group
Meteor.publish('groupUsers', function(groupId) {
  check(groupId, String);

  var group = Groups.findOne(groupId);
  var selector = {_id: {$in: group.members}}
  var fields = {
    fields: {
      'profile.username': 1,
      'profile.avatar': 1,
      '_id': 1
    }
  }

  return UserList.find(selector, fields);
});