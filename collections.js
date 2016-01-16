QuestionList = new Meteor.Collection('questions');
UserList = Meteor.users
Badges = new Meteor.Collection('badges');
Trophies = new Meteor.Collection('trophies');
Groups = new Meteor.Collection('groups');
Games = new Meteor.Collection('games')
Chat = new Meteor.Collection('chat')
// Notifications = new Meteor.Collection('notifications')
// Tasks = new Mongo.Collection("tasks");

Groups.initEasySearch('groupId');
UserList.initEasySearch('profile.username');
