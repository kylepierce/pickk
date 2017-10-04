Questions = new Meteor.Collection('questions');
UserList = Meteor.users;
Badges = new Meteor.Collection('badges');
Trophies = new Meteor.Collection('trophies');
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
// Hero = new Meteor.Collection('hero');
Multipliers = new Meteor.Collection('multipliers');
Rules = new Meteor.Collection('rules');
Admin = new Meteor.Collection('admin');
QuestionReport = new Meteor.Collection('questionReport');

UserListIndex = new EasySearch.Index({
  collection: UserList,
  fields: ['profile.username'],
  defaultSearchOptions: { limit: 5 },
  engine: new EasySearch.MongoDB({
    fields: function() {
      return {'profile.username': 1, 'profile.avatar': 1};
    }
  })
});

QuestionReport.allow({
  insert: function(userId, doc) {
    console.log(userId, doc);
    return !! userId;
  },
  update: function(userId, doc) {
    console.log(userId, doc);
    return !! userId;
  },
  remove: function(userId, doc){
    return !! userId;
  }
});
