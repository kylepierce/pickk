Questions = new Meteor.Collection('questions');
UserList = Meteor.users;
Badges = new Meteor.Collection('badges');
Trophies = new Meteor.Collection('trophies');
Groups = new Meteor.Collection('groups');
Games = new Meteor.Collection('games');
Chat = new Meteor.Collection('chat');
AtBat = new Meteor.Collection('atBat');
Teams = new Meteor.Collection('teams');
Players = new Meteor.Collection('players');
FutureTasks = new Meteor.Collection('future_tasks');
SportRadarGames = new Meteor.Collection('SportRadarGames');
Answers = new Meteor.Collection('answers');
GamePlayed = new Meteor.Collection('gamePlayed');
Notifications = new Meteor.Collection('notifications');
Hero = new Meteor.Collection('hero'); 

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
  engine: new EasySearch.MongoDB({
    fields: function() {
      return {'name': 1, 'groupId': 1, 'avatar': 1};
    }
  })
});

//Groups Schema
GroupsSchema = new SimpleSchema({
  name: {
    label: "Group Display Name",
    type: String,
    max: 256,
    unique: true
  },
  commissioner: {
    label: "Commissioner",
    type: String,
    max: 128
  },
  dateCreated: {
    label: "Date Created",
    type: Date
  },
  members: {
    type: Array
  },
  'members.$': { 
    type: String
  },
  invites: {
    type: Array
  },
  'invites.$': { 
    type: String
  },
  secret: {
    type: String
  },
  avatar: {
    label: "Avatar",
    type: String,
    max: 256
  }
});

GroupsSchema.messages({
  notUnique: "Someone already used this group name! :("
});

Groups.attachSchema(GroupsSchema);
