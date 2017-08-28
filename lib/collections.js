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
Hero = new Meteor.Collection('hero');
Multipliers = new Meteor.Collection('multipliers');
Rules = new Meteor.Collection('rules');
Admin = new Meteor.Collection('admin');

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

GroupsIndex = new EasySearch.Index({
  collection: Groups,
  fields: ['name'],
  engine: new EasySearch.MongoDB({
    fields: function() {
      return {'name': 1, 'groupId': 1, 'avatar': 1, 'commissioner': 1, "members": 1};
    }
  })
});

HeroSchema = new SimpleSchema({
  startDate: {
    label: "Start Display",
    type: Date,
    autoform: {
      type: 'datetime-local',
      // opts: optsDatetimepicker,
    },
  },
  endDate: {
    label: "End Display",
    type: Date,
    autoform: {
      type: 'datetime-local',
      // opts: optsDatetimepicker,
    },
  },
  liveStartDate: {
    label: "Start Live",
    type: Date,
    autoform: {
      type: 'datetime-local',
      // opts: optsDatetimepicker,
    },
    optional: true,
  },
  liveEndDate: {
    label: "End Live",
    type: Date,
    autoform: {
      type: 'datetime-local',
      // opts: optsDatetimepicker,
    },
    optional: true,
  },
  button: {
    label: "Button?",
    type: Boolean,
    optional: true,
  },
  buttonText: {
    label: "Button Text",
    type: String,
    optional: true,
  },
  active: {
    label: "Is active",
    type: Boolean,
  },
  image: {
    label: "Image Url",
    type: String,
  },
  url: {
    label: "Url",
    type: String,
  },
  important: {
    label: "Important",
    type: Boolean,
  }
});

Hero.attachSchema(HeroSchema);
