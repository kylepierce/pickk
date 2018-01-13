var settings = Meteor.settings.private.mailgunApi
var mg = new Mailgun({ apiKey: settings.apiKey, domain: settings.domain })
var domain = settings.domain
var listAddress = "all@" + domain
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
  'sendTestNewsletter': function(url){
    check(url, String);
    var deeplink = url;
    var shortlink = HTTP.post("https://api.branch.io/v1/url", {
      "data": {
        "branch_key": "key_live_ppziaDSmTGvzyWPJ66QaqjocuvaXZc9M",
        "data": {
          "$canonical_identifier": deeplink,
          "$og_title": "Philadelphia Eagles vs Atlanta Falcons on NBC!",
          "$og_description": "Live Contest! Watch Atlanta Falcons vs Philadelphia Eagles on NBC at 4:35pm!",
          "$desktop_url": "https://pickk.co/?utm_content=PHIvsATL",
          "$deeplink_path": deeplink
        }
      }
    });

    SSR.compileTemplate('game', Assets.getText('email-templates/game.html'));
    
    Template.game.helpers({
      prizes: function(){
        return Prizes.find({active: true}, {sort: {"rank": 1}});
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
              // record: "(" + game.home.record.wins + "-" + game.home.record.losses + ")",
              nickname: game.home.nickname
            },
            away: {
              shortCode: game.away.abbreviation.toUpperCase(),
              color: "#" + awayColor.hex[0],
              // record: "(" + game.away.record.wins + "-" + game.away.record.losses + ")",
              nickname: game.away.nickname
            }
          }
        });
        return games
      }
    });
    var entire = {
      headline: "Divisional Playoffs!",
      preheader: "Two Live Contests Tonight. Prizes for top 4 in every quarter!",
      copyAbove: "We are hosting a contest for every quarter for today's playoff games! Rank in the top 4 places for our pre game Pickk Six or in Quarter 1-4 for a chance to win Best Buy Gift Cards! <br><br><strong>To win you must join the quarter matchup.</strong> <br><br> View the prizes in the app!",
      buttonText: "Answer Pre Game Pickks",
      gameIds: ['5a514a9cfd680b1502857e9e', "5a514a9cfd680b1502857e9f"],
      url: shortlink.data.url,
      copyBelow: "Invite a Friend to a Head to Head Matchup to Prove Who Knows Football!",
      reason: "You received this email because you created an account in the app.",
    }

    var html = SSR.render('game', entire);

    var text = entire.headline + " " + entire.copyAbove + " " + entire.buttonText + " " + entire.url + " " + entire.copyBelow
    
    mg.send({
      from: "Jessica at Pickk App<hi@pickk.co>",
      to: listAddress,
      subject: "NFL Playoffs Starts in 4 Hours!",
      text: text,
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