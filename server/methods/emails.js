var settings = Meteor.settings.private.mailgunApi
var mg = new Mailgun({ apiKey: settings.apiKey, domain: settings.domain })
var domain = settings.domain
var listAddress = "test@" + domain
var list = mg.api.lists(listAddress);

Meteor.methods({
  'addEmailArray': function(){
    // If user signed up with facebook
    var selector = { 'services.facebook.email': { $exists: true } }
    var projection = { fields: { services: 1, emails: 1 }, limit: 10 }

    var users = UserList.find(selector, projection).map(function (user, index) {
      // Update the user with email array that already exists.
    });
  },
  'findEmails': function(){
    // Find every account that has 'emails' key
    var selector = { 'services.facebook.email': { $exists: true } }
    var projection = { fields: { profile: 1, services: 1, createdAt: 1}}

    var users = UserList.find(selector, projection).map(function(user, index){
      // Each account with email I want to get the first item address
      valueLength = function(key){if(key){return key.length} else {return 0}}
      valueBool = function (key) { if (key) { return key } else { return false } }
      var memberObj = {
        name: user.profile.firstName + " " + user.profile.lastName,
        address: user.services.facebook.email,
        vars: {
          firstName: user.profile.firstName, 
          lastName: user.profile.lastName,
          username: user.profile.username,
          onboarded: valueBool(user.profile.isOnboarded),
          dateCreated: user.createdAt, 
          followersCount: valueLength(user.profile.followers),
          followingCount: valueLength(user.profile.following),
          leagueCount: valueLength(user.profile.groups),
          dateAdded: new Date(),
        }
      } 
      return memberObj
    });
    // Get item in array between 0 and 1000
  
    var byThousand = users.length / 1000
    for (var index = 0; index < byThousand; index++) {
      var startInt = parseInt(index.toString() + "000")
      var selection = users.slice(startInt, startInt + 1000);
      list.members().add({ members: selection, subscribed: true }, function (error, response) {
        if (error) {
          console.log(error)
        } else {
          console.log(response)
        }
      });
    }
  },
  'sendTestNewsletter': function(){
    SSR.compileTemplate('game', Assets.getText('email-templates/game.html'));
    
    Template.game.helpers({
      prizes: function(){
        return Prizes.find({active: true}, {limit: 3});
      },
      game: function (gameIds) {
        var games = Games.find({_id: {$in: gameIds}}).map(function(game){
          var gameTime = moment(game.iso)
          if (!timezone) { var timezone = "America/New_York" }
          var homeColor = Teams.findOne({ statsTeamId: game.home.teamId })
          var awayColor = Teams.findOne({ statsTeamId: game.away.teamId })
          return {
            tv: game.tv,
            gameTime: gameTime.tz(timezone).format("h:mm a") + " ET" ,
            home: {
              shortCode: game.home.abbreviation.toUpperCase(),
              color: "#" + homeColor.hex[0],
              record: "(" + game.home.record.wins + "-" + game.home.record.losses + ")",
              nickname: game.home.nickname
            },
            away: {
              shortCode: game.away.abbreviation.toUpperCase(),
              color: "#" + awayColor.hex[0],
              record: "(" + game.away.record.wins + "-" + game.away.record.losses + ")",
              nickname: game.away.nickname
            }
          }
        });
        return games
      }
    });

    var html = SSR.render('game', {
      headline: "Three Great Games!",
      preheader: "Thanksgiving = Football. Watch the game with friends!",
      copyAbove: "Thanksgiving means family, food, and football. Give thanks for football!",
      buttonText: "Answer Pre Game Pickks",
      gameIds: ['5a0e37d344121ae7515d45db', "5a0e37d344121ae7515d45dc", "5a0e37d344121ae7515d45dd"],
      url: "https://pickk.co",
      copyBelow: "If you have any questions, just reply to this email! We're always happy to help out.",
      reason: "You received this email because you created an account in the app.",
    });
    
    mg.send({
      from: "Pickk App<hi@pickk.co>",
      to: listAddress,
      subject: "Thanksgiving Pre Pickks Open!",
      text: "Thanksgiving means family, food, and football. Give thanks for football!",
      html: html
    }, function (error, body) {
      console.log(body);
    });
  }
});

      // list.members().create({
      //   subscribed: true,
      //   vars: {
      //     firstName: user.profile.firstName, 
      //     lastName: user.profile.lastName,
      //     username: user.profile.username,
      //     onboarded: valueBool(user.profile.isOnboarded),
      //     dateCreated: user.createdAt, 
      //     followersCount: valueLength(user.profile.followers),
      //     followingCount: valueLength(user.profile.following),
      //     leagueCount: valueLength(user.profile.groups),
      //     dateAdded: new Date(),
      //   },
      //   name: user.profile.firstName + " " + user.profile.lastName,
      //   address: user.emails[0].address
      // }, (error, response) => {
      //   if (error) {
      //     console.log(error)
      //     // throw new Meteor.Error('mailgun-error', error);
      //   } else {
      //     console.log("Added: ", index, user.emails[0].address)
      //   }
      // });


// list.members().create({
//   subscribed: true,
//   vars: {
//     firstName: "kyle",
//     lastName: "Pierce",
//     username: "poppper",
//     onboarded: true,
//     dateCreated: new Date(),
//     followersCount: 0,
//     followingCount: 0,
//     leagueCount: 12,
//     dateAdded: new Date(),
//   },
//   name: "Kyle Pierce",
//   address: "kyle@pickk.co"
// }, (error, response) => {
//   if (error) {
//     console.log(error)
//     // throw new Meteor.Error('mailgun-error', error);
//   } else {
//     // console.log("Added: ", index, user.emails[0].address)
//   }
// });