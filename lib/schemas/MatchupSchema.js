//Groups Schema
Matchup = new Meteor.Collection('matchup');

Matchup.attachSchema(new SimpleSchema({
  // name: {
  //   label: "League Name",
  //   type: String,
  //   min: 5,
  //   max: 16,
  //   regEx: /^[\w\d][\w\d_]+$/i
  // },
  // description: {
  //   label: "Display Settings",
  //   type: String,
  //   optional: true
  // },
  // featured: {
  //   type: Boolean,
  //
  // },
  gameId: {
    label: "Select Game",
    type: String,
    autoform: {
      options: function () {
        var start = moment().startOf('day')
        var games = Games.find().fetch();
        console.log(games);
        return _.map(games, function (i) {
          return {label:  i.name, value: i._id};
        });
      }
    }
  },
  groupId: {
    type: String,
    optional: true
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
    allowedValues: ['private', 'invite', 'public'],
    autoform: {
      options: [
        {label: "Private", value: "private"},
        {label: "Invite Only", value: "invite"},
        {label: "Public", value: "public"}
      ]
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
