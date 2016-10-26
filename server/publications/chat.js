// Chat
Meteor.publish('chatMessages', function(groupId, limit) {
  check(groupId, Match.Maybe(String));
  check(limit, Match.Maybe(Number));
  this.unblock()
  limit = limit || 10;
  return Chat.find({group: groupId}, {sort: {dateCreated: -1}, limit: limit});
});

// Lets "Load more chats work"
Meteor.publish("chatMessagesCount", function(groupId) {
  check(groupId, Match.Maybe(String));
  this.unblock()
  Counts.publish(this, "chatMessagesCount", Chat.find({group: groupId}));
});

// Hacky way to load chat users
// Meteor.publish('chatUsers', function(id) {
//   check(id, Array);

//   var fields = { fields: {
//     'profile.username': 1,
//     'profile.avatar': 1,
//     'services': 1,
//     '_id': 1
//   }}
//   return UserList.find({_id: {$in: id}}, fields)
// });

// "Improved way"
Meteor.publish('chatUsersList', function(limit, groupId) {
  check( limit, Match.Maybe(Number) );
  check( groupId, Match.Maybe(String) );
  this.unblock()
  groupId = groupId || null;
  limit = limit + 10

  var messages = Chat.find({group: groupId}, {fields: {user: 1, dateCreated: 1}, limit: limit, sort: {dateCreated: -1}}).fetch();
  var userIds = _.chain(messages).pluck("user").uniq().value();

  var users = UserList.find({_id: {$in: userIds}}, { 
    limit: limit,
    fields: {
      'profile.username': 1,
      'profile.avatar': 1,
      'services': 1,
      '_id': 1
    }, 
  });
  return users;
});

// Mention another player. Switch to load latest users first
Meteor.publish("chatUsersAutocomplete", function(selector, options, collection) {
  check(selector, Match.Maybe(Object));
  check(options, Match.Maybe(Object));
  check(collection, String);

  if (!this.userId) {
    return this.ready()
  }
  if (_.isEmpty(selector)) {
    return this.ready()
  }
  options.limit = Math.min(5, Math.abs(options.limit || 5));
  Autocomplete.publishCursor(UserList.find(selector, options), this);
  return this.ready()
});

Meteor.publish('singleMessage', function(messageId){
  check(messageId, String);
  this.unblock()
  return Chat.find({_id: messageId})
});

