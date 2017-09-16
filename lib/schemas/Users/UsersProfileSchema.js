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
  // emails: {
  //     type: [Object],
  //     optional: true
  // },
  // "emails.$.address": {
  //   label: "Email Address",
  //   type: String,
  //   regEx: SimpleSchema.RegEx.Email,
  //   custom: function() {
  //     if (Meteor.isClient && this.isSet) {
  //       Meteor.call("isEmailUnique", this.value, function(error, isEmailUnique) {
  //         if (!isEmailUnique) {
  //           UsersProfileSchema.namedContext("settings").addInvalidKeys([{name: "emails.$.address", type: "notUnique"}]);
  //         }
  //       });
  //     }
  //   }
  // },
  "profile.firstName": {
    label: "First Name",
    type: String,
    max: 50,
    // optional: true
  },
  "profile.lastName": {
    label: "Last Name",
    type: String,
    max: 50,
    // optional: true
  },
  "profile.birthday": {
    label: "Birthday",
    type: Date,
    min: new Date(moment().subtract(120, 'years').startOf('day')),
    max: new Date(moment().subtract(17, 'years').startOf('day')),
    // optional: true
  },
});

// Matchup.attachSchema([
//   UsersProfileSchema,
//   UsersProfileSchema.favoriteSports,
//   UsersProfileSchema.favoriteNFLTeams,
//   UsersProfileSchema.favoriteMLBTeams,
//   UsersProfileSchema.favoriteNBATeams
// ]);

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
