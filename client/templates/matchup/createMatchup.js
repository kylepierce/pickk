Schema.who = new SimpleSchema({
  limitNum: {
    type: Number,
    autoform: {
      template: "small",
      type: "select-radio",
      options: [
        {label: "Head to Head", value: 2},
        {label: "4 Users", value: 4},
        {label: "8 Users", value: 8},
        {label: "16 Users", value: 16},
        {label: "32 Users", value: 32},
        {label: "No Limit", value: -1},
      ]
    },
  },
  secret: {
    label: "Display Settings",
    type: String,
    allowedValues: ['public', 'invite', 'league' ],
    autoform: {
      template: "ionic2",
      type: "select-radio",
      options: [
        {label: "Public", value: "public"},
        {label: "Invite Only", value: "invite"},
        {label: "League", value: "league"},
      ]
    }
  },
  leagueId: {
    label: "League",
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
});

Schema.length = new SimpleSchema({
  matchupLength: {
    label: "Length of Matchup",
    type: String,
    allowedValues: ['1Q', '1H', '1G', '2Q', '2H', '2G', '3Q', '3H', '3G'],
    autoform: {
      template: "small",
      type: "select-radio",
      options: [
        {label: "1 Quarter", value: "1Q"},
        {label: "1 Half", value: "1H"},
        {label: "1 Game", value: "1G"},
        // {label: "2 Quarters", value: "2Q"},
        // {label: "2 Half", value: "2H"},
        // {label: "2 Game", value: "2G"},
        // {label: "3 Quarters", value: "3Q"},
        // {label: "3 Half", value: "3H"},
        // {label: "3 Game", value: "3G"},
      ]
    }
  },
});

Schema.games = new SimpleSchema({
  gameId: {
    label: "Select Game",
    type: String,
    autoform: {
      type: "select-radio",
      template: "games",
      options: function () {
        var games = Games.find().fetch();

        formatGames = function(games){
          return _.map(games, function(game){
            return {label:  game.name, value: game._id};
          });
        }

        getSingleDay = function(day){
          var start = moment().startOf('day').add(4, "h").add(day, "d").toISOString()
          var end = moment().endOf('day').add(4, "h").add(day, "d").toISOString()
          var daysGames = _.filter(games, function(game){
            return moment(game.iso).isBetween(start, end)
          });
          return {label: start, options: formatGames(daysGames)}
        }

        var days = _.range(14)
        var twoWeeks = _.map(days, function(day){
          return getSingleDay(day)
        });

        return twoWeeks
      }
    }
  },
});

Schema.extraDetails = new SimpleSchema({
  description: {
    label: "Describe",
    type: String
  },
  featured: {
    type: Boolean,
    optional: true,
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
});

Matchup.attachSchema([
  Schema.who,
  Schema.length,
  Schema.games,
  Schema.extraDetails,
  Schema.matchupInital
]);

Wizard.useRouter('iron:router');

Template.createMatchup.helpers({
  league: function(){
    var secret = Session.get('secret');
    if (secret === "league"){
      return true
    }
  },
  steps: function() {
    return [
      {
      id: 'selectUsers',
      formId: "selectUsers",
      template: 'selectWho',
      schema: Schema.who,
    },{
      id: 'matchupLength',
      formId: 'matchupLength',
      schema: Schema.length,
      template: 'matchupLength',
    },{
      id: 'matchupGames',
      schema: Schema.games,
      formId: 'matchupGames',
      template: 'matchupGames',
      nextButton: "Confirm Details"
    },{
      id: 'details',
      schema: Schema.extraDetails,
      template: "matchupFinalDetails",
      formId: 'matchup-details',
      onSubmit: function(data, wizard) {
        var self = this;
        Matchup.insert(
          _.extend(wizard.mergedData(), data), function(err, id) {
            if (err) {self.done();}
            else {Router.go('matchup.show', {_id: id});
          }
        });
      }
    }
  ]
  }
});
//
// Template.createMatchup.events({
//   'click button': function(e, template) {
//     e.preventDefault();
//     console.log(e, template);
//     // this.wizard.next();
//   }
// });
