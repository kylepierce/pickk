Meteor.publish('userProfile', function(id) {
  check(id, String);

  var fields = {fields: {'createdAt': 1,'profile': 1,'_id': 1}}
  return UserList.find({_id: id}, fields);
});