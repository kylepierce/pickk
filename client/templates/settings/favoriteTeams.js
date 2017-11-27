Template.favoriteTeams.helpers({
  steps: function() {
    return [{
      id: 'selectSports',
      formId: "selectSports",
      template: 'favoriteSports',
      schema: UsersProfileSchema.favoriteSports,
    },{
      id: 'favoriteNFL',
      formId: 'favoriteNFL',
      schema: UsersProfileSchema.favoriteNFL,
      template: 'favoriteNFL',
    },{
      id: 'favoriteMLB',
      schema: UsersProfileSchema.favoriteMLB,
      formId: 'favoriteMLB',
      template: 'favoriteMLB',
    },{
      id: 'favoriteNBA',
      schema: UsersProfileSchema.favoriteNBA,
      template: "favoriteNBA",
      formId: 'favoriteNBA',
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



UsersProfileSchema.favoriteSports = new SimpleSchema({
  favoriteSports: {
    label: "Favorite Sports",
    type: [String],
    autoform: {
      template: "ionic2",
      type: "select-checkbox",
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
  }
});

UsersProfileSchema.favoriteNFLTeams = new SimpleSchema({
  favoriteNFLTeams: {
    label: "Favorite NFL Team (Limit 3)",
    type: [String],
    maxCount: 3,
    autoform: {
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
        {label: "Los Angeles Chargers", value: "nfl-lac"},
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
        {label: "San Francisco 49ers", value: "nfl-sf"},
        {label: "Seattle Seahawks", value: "nfl-sea"},
        {label: "Tampa Bay Buccaneers", value: "nfl-tb"},
        {label: "Tennessee Titans", value: "nfl-ten"},
        {label: "Washington Redskins", value: "nfl-was"},
      ]
    },
    optional: true
  },
});

UsersProfileSchema.favoriteMLBTeams = new SimpleSchema({
  favoriteMLBTeams: {
    label: "Favorite MLB Team (Limit 3)",
    type: [String],
    maxCount: 3,
    autoform: {
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
});

UsersProfileSchema.favoriteNBATeams = new SimpleSchema({
  favoriteNBATeams: {
    label: "Favorite NBA Team (Limit 3)",
    type: [String],
    maxCount: 3,
    autoform: {
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

// var currentStep = new ReactiveVar('');
// var currentValue = new ReactiveVar("sports")
// var stepsToDo = [];   // Start with sports selection, and then add selected teams
//
// var hooksObj = {
//   onSubmit: function (insertDoc, updateDoc, currentDoc) {
//     this.event.preventDefault();
//     var done = this.done;
//     console.log(insertDoc, updateDoc, currentDoc);
//     if (!updateDoc['$set']) {
//       IonLoading.show({
//         customTemplate: "Please Select At Least One... ",
//         duration: 1000,
//         backdrop: true
//       });
//       done(new Error('Invalid selection'));
//       return false;
//     }
//
//     var selectionArray = updateDoc['$set'][currentStep.get()];
//
//     if (currentStep.get() === 'favoriteSports') {
//       stepsToDo = selectionArray;   // Used to move to next step
//     }
//     var type = currentStep.get()
//     var userId = Meteor.userId()
//     var data = {}
//     data.type = selectionArray
//     data.userId = userId;
//
//     analytics.identify(userId, data)
//     Meteor.call('updateFavorites', selectionArray, type, function(error) {
//       if (error) {
//         IonLoading.show({
//           customTemplate: error,
//           duration: 1000,
//           backdrop: true
//         });
//         done(error);
//       } else {
//         IonLoading.show({
//           customTemplate: "Updating Profile",
//           duration: 500,
//           backdrop: true
//         });
//         done();
//         moveNextStep();
//       }
//     });
//     done();
//     return false;
//   }
// };
//
// AutoForm.addHooks(['favoriteSports', 'favoriteMLBTeams', 'favoriteNFLTeams', 'favoriteNBATeams'], hooksObj);
//
// Template.favoriteTeams.onCreated(function (){
//   this.allSteps = [ 'favoriteSports', 'favoriteMLBTeams', 'favoriteNFLTeams', 'favoriteNBATeams'];
//   currentStep = new ReactiveVar('favoriteSports');
// });
//
//
// Template.favoriteTeams.helpers({
//   allSteps: function () {
//     return Template.instance().allSteps;
//   },
//   UsersProfileSchema: function() {
//     return UsersProfileSchema;
//   },
//   hide: function (step) {
//     if (step !== currentStep.get()) {
//       return 'hidden';
//     }
//   },
//   submitText: function (e,t) {
//     if (this.valueOf() === "favoriteSports"){
//       return "Save Favorite Sports"
//     } else if (this.valueOf() === "favoriteNBATeams") {
//       return "Update Favorite NBA Teams"
//     } else if (this.valueOf() === "favoriteMLBTeams") {
//       return "Update Favorite MLB Teams"
//     } else if (this.valueOf() === "favoriteNFLTeams") {
//       return "Update Favorite NFL Teams"
//     }
//   }
// });
//
// var moveNextStep = function () {
//   var step = stepsToDo.pop();
//   if (step) {
//     currentStep.set('favorite' + step + 'Teams');
//     currentValue.set(step);
//     $('.header-text').text('Teams');
//   } else {
//     // End of steps
//     if (Meteor.user().profile.isOnboarded) {
//       Router.go('/');
//     } else {
//       Meteor.call('onBoarded');
//       if (Meteor.isCordova) {
//         Router.go('/push-active');
//       }
//     }
//   }
// }
