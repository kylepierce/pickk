Meteor.publish('userProfile', function(id) {
  check(id, String);

  var fields = {fields: {'profile': 1,'_id': 1}}
  return UserList.find({_id: id}, fields);
});