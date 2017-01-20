//Groups Schema
Matchup = new Meteor.Collection('matchup');

Matchup.attachSchema(new SimpleSchema({
  gameId: {
    label: "Select Game",
    type: String,
    autoform: {
      options: function () {
        var games = Games.find().fetch();
        return _.map(games, function (i) {
          return {label:  i.name, value: i._id};
        });
      }
    }
  },
  limit: {
    type: String,
    optional: true,
    autoform: {
      options: [
        {label: "No Limit", value: false},
        {label: "Limit # of Users", value: true}
      ]
    }
  },
  limitNum: {
    type: Number,
    defaultValue: -1,
    autoform: {
      options: [
        {label: "You vs Another", value: 2},
        {label: "4 Users", value: 4},
        {label: "8 Users", value: 8},
        {label: "16 Users", value: 16},
        {label: "32 Users", value: 32},
      ]
    },
    optional: true
  },
  secret: {
    label: "Display Settings",
    type: String,
    allowedValues: ['public', 'invite', 'group' ],
    autoform: {
      options: [
        {label: "Public", value: "public"},
        {label: "Invite Only", value: "invite"},
        {label: "Group", value: "group"},
      ]
    }
  },
  groupId: {
    label: "Group",
    type: String,
    optional: true,
    autoform: {
      options: function () {
        var user = this.userId
        var groups = Groups.find({}).fetch()
        return _.map(groups, function (i) {
          return {label:  i.name, value: i._id};
        });
      }
    }
  },
  skill: {
    label: "Skill Level Required",
    type: Array,
    allowedValues: ['All', 'JV', 'Varsity', 'Semi-Pro', 'Pro', 'All Pro'],
    autoform: {
      options: function () {
        return _.map(['All', 'JV', 'Varsity', 'Semi-Pro', 'Pro', 'All Pro'], function (i) {
          return {label:  i, value: i};
        });
      }
    }
  },
  'skill.$': {
    type: String
  },
  commissioner: {
    type: String,
    autoValue: function(){
      if ( this.isInsert ) {
        return this.userId
      }
    },
  },
  dateCreated: {
    type: Date,
    autoValue: function(){
      if ( this.isInsert ) {
        return new Date;
      }
     }
  },
  users: {
    type: Array,
    autoValue: function(){
      if ( this.isInsert ) {
        return [this.userId]
      }
    },
    optional: true
  },
  'users.$': {
    type: String,
    optional: true
  },
  invites: {
    type: Array,
    autoValue: function(){
      if ( this.isInsert ) {
        return []
      }
    },
    optional: true
  },
  'invites.$': {
    type: String,
    optional: true
  },
  requests: {
    type: Array,
    autoValue: function(){
      if ( this.isInsert ) {
        return []
      }
    },
    optional: true
  },
  'requests.$': {
    type: String,
    optional: true
  },
}));

// Groups.attachSchema(GroupsSchema)
//
// GroupsSchema.messages({
//   notUnique: "Someone already used this group name! :("
// });

Matchup.allow({
  insert: function(userId, doc) {
    return !! userId;
  },
  update: function(userId, doc) {
    return !! userId;
  },
  remove: function(userId, doc){
    return !! userId;
  }
});
