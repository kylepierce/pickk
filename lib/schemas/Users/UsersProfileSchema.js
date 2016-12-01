UsersProfileSchema = new SimpleSchema({
  username: {
    label: "Username",
    type: String,
    min: 3,
    max: 16,
    regEx: /^[\w\d][\w\d_]+$/i,
    custom: function() {
      if (Meteor.isClient && this.isSet) {
        Meteor.call("isUsernameUnique", this.value, function(error, isUsernameUnique) {
          if (!isUsernameUnique) {
            UsersProfileSchema.namedContext("settings").addInvalidKeys([{name: "username", type: "notUnique"}]);
          }
        });
      }
    },
    optional: true
  },
  firstName: {
    label: "First Name",
    type: String,
    max: 256,
    optional: true
  },
  lastName: {
    label: "Last Name",
    type: String,
    max: 256,
    optional: true
  },
  birthday: {
    label: "Birthday",
    type: Date,
    max: new Date(),
    optional: true
  },
  favoriteSports: {
    label: "Favorite Sports",
    type: [String],
    autoform: {
          options: [
            {label: "MLB", value: 'MLB'},
            {label: "NFL", value: 'NFL'},
            // {label: "NBA", value: 'NBA'},
            // {label: "Premier League", value: 'Premier-League'},
            // {label: "MLS", value: 'MLS'},
            // {label: "NHL", value: 'NHL'},
          ]
        },
    optional: true
  },
  favoriteMLBTeams: {
    label: "Favorite MLB Team",
    type: [String],
    maxCount: 3,
    autoform: {
          options: [
            {label: "Atlanta Braves", value: 'ATL'},
            {label: "Arizona Diamondbacks", value: 'ARI'},
            {label: "Baltimore Orioles", value: 'BAL'},
            {label: "Boston Red Sox", value: 'BOS'},
            {label: "Chicago Cubs", value: 'CHC'},
            {label: "Chicago White Sox", value: 'CHW'},
            {label: "Cleveland Indians", value: 'CLE'},
            {label: "Cincinnati Reds", value: 'CIN'},
            {label: "Colorado Rockies", value: 'COL'},
            {label: "Detroit Tigers", value: 'DET'},
            {label: "Houston Astros", value: 'HOU'},
            {label: "Kansas City Royals", value: 'KC'},
            {label: "Los Angeles Angels", value: 'LAA'},
            {label: "Los Angeles Dodgers", value: 'LAD'},
            {label: "Miami Marlins", value: 'MIA'},
            {label: "Milwaukee Brewers", value: 'MIL'},
            {label: "Minnesota Twins", value: 'MIN'},
            {label: "New York Mets", value: 'NYM'},
            {label: "New York Yankees", value: 'NYY'},
            {label: "Oakland Athletics", value: 'OAK'},
            {label: "Philadelphia Phillies", value: 'PHI'},
            {label: "Pittsburgh Pirates", value: 'PIT'},
            {label: "San Diego Padres", value: 'SD'},
            {label: "San Francisco Giants", value: 'SF'},
            {label: "Seattle Mariners", value: 'SEA'},
            {label: "St. Louis Cardinals", value: 'STL'},
            {label: "Tampa Bay Rays", value: 'TB'},
            {label: "Texas Rangers", value: 'TEX'},
            {label: "Toronto Blue Jays", value: 'TOR'},
            {label: "Washington Nationals", value: 'WSH'}
          ]
        },
    optional: true
  },
  favoriteNFLTeams: {
    label: "Favorite NFL Team",
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
  }
});

UsersProfileSchema.messages({
  // The username must be at least 3 characters long.
  // The username can not be longer than 15 characters.
  regEx: "[label] can only contain letters, numbers and underscores (but shouldn't begin with underscore)",
  notUnique: "Someone already has that username! :("
});
