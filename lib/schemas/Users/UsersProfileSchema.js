UsersProfileSchema = new SimpleSchema({
  "profile.username": {
    label: "Username",
    type: String,
    min: 3,
    max: 16,
    regEx: /^[\w\d][\w\d_]+$/i,
    custom: function() {
      if (Meteor.isClient && this.isSet) {
        Meteor.call("isUsernameUnique", this.value, function(error, isUsernameUnique) {
          if (!isUsernameUnique) {
            UsersProfileSchema.namedContext("settings").addInvalidKeys([{name: "profile.username", type: "notUnique"}]);
          }
        });
      }
    }
  },
  emails: {
      type: [Object],
      optional: true
  },
  "emails.$.address": {
    label: "Email Address",
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    custom: function() {
      if (Meteor.isClient && this.isSet) {
        Meteor.call("isEmailUnique", this.value, function(error, isEmailUnique) {
          if (!isEmailUnique) {
            UsersProfileSchema.namedContext("settings").addInvalidKeys([{name: "emails.$.address", type: "notUnique"}]);
          }
        });
      }
    }
  },
  "profile.firstName": {
    label: "First Name",
    type: String,
    max: 256,
    optional: true
  },
  "profile.lastName": {
    label: "Last Name",
    type: String,
    max: 256,
    optional: true
  },
  "profile.birthday": {
    label: "Birthday",
    type: Date,
    min: new Date(moment().subtract(120, 'years').startOf('day')),
    max: new Date(moment().subtract(13, 'years').startOf('day')),
    optional: true
  },
  favoriteSports: {
    label: "Favorite Sports",
    type: [String],
    autoform: {
          options: [
            {label: "MLB", value: 'MLB'},
            {label: "NFL", value: 'NFL'},
            {label: "NBA", value: 'NBA'},
            // {label: "Premier League", value: 'Premier-League'},
            // {label: "MLS", value: 'MLS'},
            // {label: "NHL", value: 'NHL'}
          ]
        },
    optional: true
  },
  favoriteMLBTeams: {
    label: "Favorite MLB Team (Limit 3)",
    type: [String],
    maxCount: 3,
    autoform: {
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
  favoriteNFLTeams: {
    label: "Favorite NFL Team (Limit 3)",
    type: [String],
    maxCount: 3,
    autoform: {
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
  favoriteNBATeams: {
    label: "Favorite NBA Team (Limit 3)",
    type: [String],
    maxCount: 3,
    autoform: {
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

UsersProfileSchema.messages({
  // The username must be at least 3 characters long.
  // The username can not be longer than 15 characters.
  regEx: "[label] can only contain letters, numbers and underscores (but shouldn't begin with underscore)",
  notUnique: "Someone already has that [label]! :("
});

// favoritePremierLeagueTeams: {
//   label: "Favorite Premier League Team",
//   type: [String],
//   maxCount: 3,
//   autoform: {
//         options: [
//           {label: "Atlanta Hawks", value: "nba-ATL"},
//           {label: "Brooklyn Nets", value: "nba-BKN"},
//           {label: "Boston Celtics", value: "nba-BOS"},
//           {label: "Charlotte Hornets", value: "nba-CHA"},
//           {label: "Chicago Bulls", value: "nba-CHI"},
//           {label: "Cleveland Cavaliers", value: "nba-CLE"},
//           {label: "Dallas Mavericks", value: "nba-DAL"},
//           {label: "Denver Nuggets", value: "nba-DEN"},
//           {label: "Detroit Pistons", value: "nba-DET"},
//           {label: "Golden State Warriors", value: "nba-GSW"},
//           {label: "Houston Rockets", value: "nba-HOU"},
//           {label: "Indiana Pacers", value: "nba-IND"},
//           {label: "Los Angeles Clippers", value: "nba-LAC"},
//           {label: "Los Angeles Lakers", value: "nba-LAL"},
//           {label: "Memphis Grizzlies", value: "nba-MEM"},
//           {label: "Miami Heat", value: "nba-MIA"},
//           {label: "Milwaukee Bucks", value: "nba-MIL"},
//           {label: "Minnesota Timberwolves", value: "nba-MIN"},
//           {label: "New Orleans Pelicans", value: "nba-NOP"},
//           {label: "New York Knicks", value: "nba-NYK"},
//           {label: "Oklahoma City Thunder", value: "nba-OKC"},
//           {label: "Orlando Magic", value: "nba-ORL"},
//           {label: "Philadelphia 76ers", value: "nba-PHI"},
//           {label: "Phoenix Suns", value: "nba-PHX"},
//           {label: "Portland Trail Blazers", value: "nba-POR"},
//           {label: "Sacramento Kings", value: "nba-SAC"},
//           {label: "San Antonio Spurs", value: "nba-SAS"},
//           {label: "Toronto Raptors", value: "nba-TOR"},
//           {label: "Utah Jazz", value: "nba-UTA"},
//           {label: "Washington Wizards", value: "nba-WSH"}
//         ]
//       },
//   optional: true
// },
// favoriteMLSTeams: {
//   label: "Favorite MLS League Team",
//   type: [String],
//   maxCount: 3,
//   autoform: {
//         options: [
//           {label: "Atlanta Hawks", value: "nba-ATL"},
//           {label: "Brooklyn Nets", value: "nba-BKN"},
//           {label: "Boston Celtics", value: "nba-BOS"},
//           {label: "Charlotte Hornets", value: "nba-CHA"},
//           {label: "Chicago Bulls", value: "nba-CHI"},
//           {label: "Cleveland Cavaliers", value: "nba-CLE"},
//           {label: "Dallas Mavericks", value: "nba-DAL"},
//           {label: "Denver Nuggets", value: "nba-DEN"},
//           {label: "Detroit Pistons", value: "nba-DET"},
//           {label: "Golden State Warriors", value: "nba-GSW"},
//           {label: "Houston Rockets", value: "nba-HOU"},
//           {label: "Indiana Pacers", value: "nba-IND"},
//           {label: "Los Angeles Clippers", value: "nba-LAC"},
//           {label: "Los Angeles Lakers", value: "nba-LAL"},
//           {label: "Memphis Grizzlies", value: "nba-MEM"},
//           {label: "Miami Heat", value: "nba-MIA"},
//           {label: "Milwaukee Bucks", value: "nba-MIL"},
//           {label: "Minnesota Timberwolves", value: "nba-MIN"},
//           {label: "New Orleans Pelicans", value: "nba-NOP"},
//           {label: "New York Knicks", value: "nba-NYK"},
//           {label: "Oklahoma City Thunder", value: "nba-OKC"},
//           {label: "Orlando Magic", value: "nba-ORL"},
//           {label: "Philadelphia 76ers", value: "nba-PHI"},
//           {label: "Phoenix Suns", value: "nba-PHX"},
//           {label: "Portland Trail Blazers", value: "nba-POR"},
//           {label: "Sacramento Kings", value: "nba-SAC"},
//           {label: "San Antonio Spurs", value: "nba-SAS"},
//           {label: "Toronto Raptors", value: "nba-TOR"},
//           {label: "Utah Jazz", value: "nba-UTA"},
//           {label: "Washington Wizards", value: "nba-WSH"}
//         ]
//       },
//   optional: true
// }
// favoriteNHLTeams: {
//   label: "Favorite NHL League Team",
//   type: [String],
//   maxCount: 3,
//   autoform: {
//         options: [
//           {label: "Atlanta Hawks", value: "nba-ATL"},
//           {label: "Brooklyn Nets", value: "nba-BKN"},
//           {label: "Boston Celtics", value: "nba-BOS"},
//           {label: "Charlotte Hornets", value: "nba-CHA"},
//           {label: "Chicago Bulls", value: "nba-CHI"},
//           {label: "Cleveland Cavaliers", value: "nba-CLE"},
//           {label: "Dallas Mavericks", value: "nba-DAL"},
//           {label: "Denver Nuggets", value: "nba-DEN"},
//           {label: "Detroit Pistons", value: "nba-DET"},
//           {label: "Golden State Warriors", value: "nba-GSW"},
//           {label: "Houston Rockets", value: "nba-HOU"},
//           {label: "Indiana Pacers", value: "nba-IND"},
//           {label: "Los Angeles Clippers", value: "nba-LAC"},
//           {label: "Los Angeles Lakers", value: "nba-LAL"},
//           {label: "Memphis Grizzlies", value: "nba-MEM"},
//           {label: "Miami Heat", value: "nba-MIA"},
//           {label: "Milwaukee Bucks", value: "nba-MIL"},
//           {label: "Minnesota Timberwolves", value: "nba-MIN"},
//           {label: "New Orleans Pelicans", value: "nba-NOP"},
//           {label: "New York Knicks", value: "nba-NYK"},
//           {label: "Oklahoma City Thunder", value: "nba-OKC"},
//           {label: "Orlando Magic", value: "nba-ORL"},
//           {label: "Philadelphia 76ers", value: "nba-PHI"},
//           {label: "Phoenix Suns", value: "nba-PHX"},
//           {label: "Portland Trail Blazers", value: "nba-POR"},
//           {label: "Sacramento Kings", value: "nba-SAC"},
//           {label: "San Antonio Spurs", value: "nba-SAS"},
//           {label: "Toronto Raptors", value: "nba-TOR"},
//           {label: "Utah Jazz", value: "nba-UTA"},
//           {label: "Washington Wizards", value: "nba-WSH"}
//         ]
//       },
//   optional: true
// }
