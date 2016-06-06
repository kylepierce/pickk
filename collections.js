QuestionList = new Meteor.Collection('questions');
UserList = Meteor.users
Badges = new Meteor.Collection('badges');
Trophies = new Meteor.Collection('trophies');
Groups = new Meteor.Collection('groups');
Games = new Meteor.Collection('games')
Chat = new Meteor.Collection('chat')
AtBat = new Meteor.Collection('atBat')
Teams = new Meteor.Collection('teams')
Players = new Meteor.Collection('players')
FutureTasks = new Meteor.Collection('future_tasks'); 

// Notifications = new Meteor.Collection('notifications')
// Tasks = new Mongo.Collection("tasks");

// Groups.initEasySearch('groupId');
// UserList.initEasySearch('profile.username');

UserListIndex = new EasySearch.Index({
  collection: UserList,
  fields: ['profile.username'],
  engine: new EasySearch.MongoDB({
    fields: function() {
      return {'profile.username': 1, 'profile.avatar': 1};
    }
  })
});

GroupsIndex = new EasySearch.Index({
  collection: Groups,
  fields: ['name'],
  engine: new EasySearch.Minimongo()
});
