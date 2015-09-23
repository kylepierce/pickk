QuestionList = new Meteor.Collection('questions');
UserList = Meteor.users
Badges = new Meteor.Collection('badges');
Trophies = new Meteor.Collection('trophies');
Groups = new Meteor.Collection('groups');
Invites = new Meteor.Collection('invites');
Games = new Meteor.Collection('games')
// Tasks = new Mongo.Collection("tasks");

Groups.initEasySearch('groupId');
UserList.initEasySearch('profile.username');
