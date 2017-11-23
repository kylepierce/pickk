Schema.who = new SimpleSchema({
  limitNum: {
    type: Number,
    autoform: {
      template: "small",
      type: "select-radio",
      options: [
        {label: "Head to Head", value: 2},
        {label: "4 Players", value: 4},
        {label: "8 Players", value: 8},
        {label: "16 Players", value: 16},
        {label: "32 Players", value: 32},
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
    label: "Matchup Game",
    type: [String],
    maxCount: 3,
    autoform: {
      type: "select-checkbox",
      template: "games",
      options: function () {
        var games = Games.find({status: "Pre-Game"}).fetch();

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
          if(daysGames.length > 0){
            return {label: start, options: formatGames(daysGames)}
          } else {
            return false
          }
        }

        var days = _.range(14)
        var twoWeeks = _.map(days, function(day){
          var list = getSingleDay(day)
          return list
        });

        return twoWeeks.filter(function(date){
          return _.isObject(date)
        });
      }
    }
  },
  'gameId.$': {
    type: String
  }
});

Schema.extraDetails = new SimpleSchema({
  period: {
    type: Array,
    optional: true,
    autoform: {
      type: "select-checkbox",
      template: "small",
    }
  },
  'period.$': {
    type: Number,
    optional: true
  },
  description: {
    label: "Describe",
    type: String,
    optional: true
  },
  featured: {
    type: Boolean,
    optional: true
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
  Schema.extraDetails
]);

Wizard.useRouter('iron:router');

Template.createMatchup.helpers({
  steps: function() {
    return [{
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
            else {
              wizard.clearData();
              Router.go('/matchup/invite/' + id);
          }
        });
      }
    }]
  }
});

Template.selectWho.helpers({
  league: function(){
    var secret = Session.get('secret');
    if (secret === "league"){
      return true
    }
  },
  userLeagues: function(){
    var groups = Groups.find({}).fetch()
    return _.map(groups, function (i) {
      return {label:  i.name, value: i._id};
    });
  }
});

Template.selectWho.events({
  'click #secret label': function(e, t){
    Session.set('secret', this.value);
  }
});

Template.matchupGames.helpers({
  dynamicFields: function(){
    var data = this.wizard.mergedData();
    var amount = data && data.matchupLength;
    return data.matchupLength
  }
});

Template.createMatchup.onCreated(function() {
  var subs = new SubsManager();
  subs.clear();
});

Template.matchupFinalDetails.helpers({
  dynamicFields: function(){
    var data = this.wizard.mergedData();
    var amount = data && data.matchupLength;
    return data.matchupLength
  },
  games: function(){
    var data = this.wizard.mergedData();
    return Games.find({_id: {$in: data.gameId}}).fetch();
  },
  matchupLength: function(letter){
    var data = this.wizard.mergedData();
    var lengthLetter = data.matchupLength[1]
    if(lengthLetter === letter){
      return true
    }
  },
  quarterOptions: function(){
    return [
      {label: "Pre-Game", value: 0},
      {label: "1st", value: 1},
      {label: "2nd", value: 2},
      {label: "3rd", value: 3},
      {label: "4th", value: 4},
    ]
  },
  halfOptions: function(){
    return [
      {label: "1st Half", value: [1, 2]},
      {label: "2nd Half", value: [2, 3]},
    ]
  }
});
