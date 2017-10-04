Meteor.publish('buttons', function(location) {
  check(location, String);
  var selector = {location: location}
  return Admin.find(selector);
});
