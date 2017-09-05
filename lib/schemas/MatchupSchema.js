//Groups Schema
Schema = {}
Matchup = new Meteor.Collection('matchup');

// Schema.Matchup = new SimpleSchema({
  // gameId: {
  //   label: "Select Game",
  //   type: String,
  //   autoform: {
  //     options: function () {
  //       var games = Games.find().fetch();
  //       return _.map(games, function (i) {
  //         return {label:  i.name, value: i._id};
  //       });
  //     }
  //   }
  // },
  // limitNum: {
  //   type: Number,
  //   autoform: {
  //     template: "small",
  //     type: "select-radio",
  //     options: [
  //       {label: "Head to Head", value: 2},
  //       {label: "4 Users", value: 4},
  //       {label: "8 Users", value: 8},
  //       {label: "16 Users", value: 16},
  //       {label: "32 Users", value: 32},
  //       {label: "No Limit", value: -1},
  //     ]
  //   },
  // },
  // secret: {
  //   label: "Display Settings",
  //   type: String,
  //   allowedValues: ['public', 'invite', 'league' ],
  //   autoform: {
  //     template: "ionic2",
  //     type: "select-radio",
  //     options: [
  //       {label: "Public", value: "public"},
  //       {label: "Invite Only", value: "invite"},
  //       {label: "League", value: "league"},
  //     ]
  //   }
  // },
  // leagueId: {
  //   label: "League",
  //   type: String,
  //   optional: true,
  //   autoform: {
  //     options: function () {
  //       var user = this.userId
  //       var groups = Groups.find({}).fetch()
  //       return _.map(groups, function (i) {
  //         return {label:  i.name, value: i._id};
  //       });
  //     }
  //   }
  // },
  // matchupLength: {
  //   label: "Length of Matchup",
  //   type: String,
  //   allowedValues: ['1Q', '1H', '1G', '2Q', '2H', '2G', '3Q', '3H', '3G'],
  //   autoform: {
  //     template: "small",
  //     type: "select-radio",
  //     options: [
  //       {label: "1 Quarter", value: "1Q"},
  //       {label: "1 Half", value: "1H"},
  //       {label: "1 Game", value: "1G"},
  //       {label: "2 Quarters", value: "2Q"},
  //       {label: "2 Half", value: "2H"},
  //       {label: "2 Game", value: "2G"},
  //       {label: "3 Quarters", value: "3Q"},
  //       {label: "3 Half", value: "3H"},
  //       {label: "3 Game", value: "3G"},
  //     ]
  //   }
  // },
  // skill: {
  //   label: "Skill Level Required",
  //   type: Array,
  //   allowedValues: ['All', 'JV', 'Varsity', 'Semi-Pro', 'Pro', 'All Pro'],
  //   autoform: {
  //     options: function () {
  //       return _.map(['All', 'JV', 'Varsity', 'Semi-Pro', 'Pro', 'All Pro'], function (i) {
  //         return {label:  i, value: i};
  //       });
  //     }
  //   }
  // },
  // 'skill.$': {
  //   type: String
  // },
// });
//
// Matchup.attachSchema(Schema.Matchup);
// // Groups.attachSchema(GroupsSchema)
// //

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
