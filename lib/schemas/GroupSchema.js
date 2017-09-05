//Groups Schema
Groups = new Meteor.Collection('groups');

GroupSchema = new SimpleSchema({
  name: {
    label: "League Name",
    type: String,
    min: 5,
    max: 16,
    regEx: /^[\w\d][\w\d_]+$/i
  },
  description: {
    label: "Display Settings",
    type: String,
    optional: true
  },
  secret: {
    label: "Display Settings",
    type: String,
    allowedValues: ['private', 'invite', 'public'],
    autoform: {
      template: "ionic2",
      type: "select",
      options: [
        {label: "Private", value: "private"},
        {label: "Invite Only", value: "invite"},
        {label: "Public", value: "public"}
      ]
    }
  },
  limitNum: {
    type: Number,
    autoform: {
      template: "small",
      type: "select",
      options: [
        {label: "No Limit", value:  -1},
        {label: "4 Users", value: 4},
        {label: "8 Users", value: 8},
        {label: "16 Users", value: 16},
        {label: "32 Users", value: 32},
        {label: "64 Users", value: 64},
      ]
    },
  },
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
  avatar: {
    label: "Avatar",
    type: String,
    optional: true
    // autoValue: function(){ return "" }
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
  members: {
    type: Array,
    autoValue: function(){
      if ( this.isInsert ) {
        return [this.userId]
      }
    },
    optional: true
  },
  'members.$': {
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
  association: {
    label: "Focused on Sports League?",
    type: Array,
    allowedValues: ['MLB', 'NFL', 'NBA'],
    optional: true,
    autoform: {
      template: "ionic2",
      type: "select-checkbox",
      options: [
        {label: "MLB", value: 'MLB'},
        {label: "NFL", value: 'NFL'},
        {label: "NBA", value: 'NBA'},
      ]
    }
  },
  'association.$': {
    type: String,
    optional: true
  },
  favoriteMLBTeam: {
    label: "MLB Team",
    type: String,
    maxCount: 1,
    autoform: {
      template: "ionic2",
      type: "select-checkbox",
      options: [
        {label: "Atlanta Braves", value: 'mlb-ATL'},
        {label: "Arizona Diamondbacks", value: 'mlb-ARI'},
        {label: "Baltimore Orioles", value: 'mlb-BAL'},
        {label: "Boston Red Sox", value: 'mlb-BOS'},
        {label: "Chicago Cubs", value: 'mlb-CHC'},
        {label: "Chicago White Sox", value: 'mlb-CHW'},
        {label: "Cleveland Indians", value: 'mlb-CLE'},
        {label: "Cincinnati Reds", value: 'mlb-CIN'},
        {label: "Colorado Rockies", value: 'mlb-COL'},
        {label: "Detroit Tigers", value: 'mlb-DET'},
        {label: "Houston Astros", value: 'mlb-HOU'},
        {label: "Kansas City Royals", value: 'mlb-KC'},
        {label: "Los Angeles Angels", value: 'mlb-LAA'},
        {label: "Los Angeles Dodgers", value: 'mlb-LAD'},
        {label: "Miami Marlins", value: 'mlb-MIA'},
        {label: "Milwaukee Brewers", value: 'mlb-MIL'},
        {label: "Minnesota Twins", value: 'mlb-MIN'},
        {label: "New York Mets", value: 'mlb-NYM'},
        {label: "New York Yankees", value: 'mlb-NYY'},
        {label: "Oakland Athletics", value: 'mlb-OAK'},
        {label: "Philadelphia Phillies", value: 'mlb-PHI'},
        {label: "Pittsburgh Pirates", value: 'mlb-PIT'},
        {label: "San Diego Padres", value: 'mlb-SD'},
        {label: "San Francisco Giants", value: 'mlb-SF'},
        {label: "Seattle Mariners", value: 'mlb-SEA'},
        {label: "St. Louis Cardinals", value: 'mlb-STL'},
        {label: "Tampa Bay Rays", value: 'mlb-TB'},
        {label: "Texas Rangers", value: 'mlb-TEX'},
        {label: "Toronto Blue Jays", value: 'mlb-TOR'},
        {label: "Washington Nationals", value: 'mlb-WSH'}
      ]
    },
    optional: true
  },
  favoriteNFLTeam: {
    label: "NFL Team",
    type: String,
    maxCount: 1,
    autoform: {
      template: "ionic2",
      type: "select-checkbox",
      options: [
        {label: "Arizona Cardinals", value: "nfl-ari"},
        {label: "Atlanta Falcons", value: "nfl-atl"},
        {label: "Baltimore Ravens", value: "nfl-bal"},
        {label: "Buffalo Bills", value: "nfl-buf"},
        {label: "Carolina Panthers", value: "nfl-car"},
        {label: "Cleveland Browns", value: "nfl-cle"},
        {label: "Cincinnati Bengals", value: "nfl-cin"},
        {label: "Chicago Bears", value: "nfl-chi"},
        {label: "Dallas Cowboys", value: "nfl-dal"},
        {label: "Denver Broncos", value: "nfl-den"},
        {label: "Detroit Lions", value: "nfl-det"},
        {label: "Green Bay Packers", value: "nfl-gb"},
        {label: "Houston Texans", value: "nfl-hou"},
        {label: "Indianapolis Colts", value: "nfl-ind"},
        {label: "Jacksonville Jaguars", value: "nfl-jax"},
        {label: "Kansas City Chiefs", value: "nfl-kc"},
        {label: "Los Angeles Rams", value: "nfl-lar"},
        {label: "Miami Dolphins", value: "nfl-mia"},
        {label: "Minnesota Vikings", value: "nfl-min"},
        {label: "New England Patriots", value: "nfl-ne"},
        {label: "New Orleans Saints", value: "nfl-no"},
        {label: "New York Jets", value: "nfl-nyj"},
        {label: "New York Giants", value: "nfl-nyg"},
        {label: "Oakland Raiders", value: "nfl-oak"},
        {label: "Philadelphia Eagles", value: "nfl-phi"},
        {label: "Pittsburgh Steelers", value: "nfl-pitt"},
        {label: "San Diego Chargers", value: "nfl-sd"},
        {label: "San Francisco 49ers", value: "nfl-sf"},
        {label: "Seattle Seahawks", value: "nfl-sea"},
        {label: "Tampa Bay Buccaneers", value: "nfl-tb"},
        {label: "Tennessee Titans", value: "nfl-ten"},
        {label: "Washington Redskins", value: "nfl-was"},
      ]
    },
    optional: true
  },
  favoriteNBATeam: {
    label: "NBA Team",
    type: String,
    maxCount: 1,
    autoform: {
      template: "ionic2",
      type: "select-checkbox",
      options: [
        {label: "Atlanta Hawks", value: "nba-ATL"},
        {label: "Brooklyn Nets", value: "nba-BKN"},
        {label: "Boston Celtics", value: "nba-BOS"},
        {label: "Charlotte Hornets", value: "nba-CHA"},
        {label: "Chicago Bulls", value: "nba-CHI"},
        {label: "Cleveland Cavaliers", value: "nba-CLE"},
        {label: "Dallas Mavericks", value: "nba-DAL"},
        {label: "Denver Nuggets", value: "nba-DEN"},
        {label: "Detroit Pistons", value: "nba-DET"},
        {label: "Golden State Warriors", value: "nba-GSW"},
        {label: "Houston Rockets", value: "nba-HOU"},
        {label: "Indiana Pacers", value: "nba-IND"},
        {label: "Los Angeles Clippers", value: "nba-LAC"},
        {label: "Los Angeles Lakers", value: "nba-LAL"},
        {label: "Memphis Grizzlies", value: "nba-MEM"},
        {label: "Miami Heat", value: "nba-MIA"},
        {label: "Milwaukee Bucks", value: "nba-MIL"},
        {label: "Minnesota Timberwolves", value: "nba-MIN"},
        {label: "New Orleans Pelicans", value: "nba-NOP"},
        {label: "New York Knicks", value: "nba-NYK"},
        {label: "Oklahoma City Thunder", value: "nba-OKC"},
        {label: "Orlando Magic", value: "nba-ORL"},
        {label: "Philadelphia 76ers", value: "nba-PHI"},
        {label: "Phoenix Suns", value: "nba-PHX"},
        {label: "Portland Trail Blazers", value: "nba-POR"},
        {label: "Sacramento Kings", value: "nba-SAC"},
        {label: "San Antonio Spurs", value: "nba-SAS"},
        {label: "Toronto Raptors", value: "nba-TOR"},
        {label: "Utah Jazz", value: "nba-UTA"},
        {label: "Washington Wizards", value: "nba-WSH"}
      ]
    },
  optional: true
  },
});

Groups.attachSchema(GroupSchema);

SimpleSchema.messages({
  // The username must be at least 3 characters long.
  // The username can not be longer than 15 characters.
  regEx: "[label] can only contain letters, numbers and underscores. No Spaces.",
  notUnique: "Someone already has that [label]! :("
});

Groups.allow({
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

GroupsIndex = new EasySearch.Index({
  collection: Groups,
  fields: ['name'],
  engine: new EasySearch.MongoDB({
    fields: function() {
      return {'name': 1, 'groupId': 1, 'avatar': 1, 'commissioner': 1, "members": 1, "limitNum": 1, "secret": 1};
    }
  })
});
