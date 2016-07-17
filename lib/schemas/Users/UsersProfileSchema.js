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
  favoriteTeams: {
    label: "Favorite Teams",
    type: [String],
    autoform: {
      type: "selectize",
      multiple: true,
      options: function () {
        return [
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
        ];
      },
      selectizeOptions: {
        hideSelected: true,
        plugins: {
          "remove_button": {}
        }
      }
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
