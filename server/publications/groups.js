// Groups

Meteor.publish('singleGroup', function(groupId) {
  check(groupId, String);

  return Groups.find({_id: groupId});
});

//Find groups that userId belongs to
Meteor.publish('findThisUsersGroups', function(userId) {
  check(userId, String);

  return Groups.find({members: {$in: [userId]}});
});

//Find groups that userId belongs to
Meteor.publish('userIsCommissioner', function(userId) {
  check(userId, String);

  return Groups.find({commissioner: {$eq: userId}}, {fields: {name: 1}});
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

Meteor.publish('leagueRequests', function(leagueId) {
  check(leagueId, String);

  var group = Groups.findOne(leagueId);
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
