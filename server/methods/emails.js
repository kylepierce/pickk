var settings = Meteor.settings.private.mailgunApi
var mg = new Mailgun({ apiKey: settings.apiKey, domain: settings.domain })
var domain = settings.domain
var listAddress = "all@" + domain
var list = mg.api.lists(listAddress);

Meteor.methods({
  'findEmails': function(){
    // Find every account that has 'emails' key

    var selector = { 'emails': { $exists: true } }
    var projection = { fields: { profile: 1, emails: 1, createdAt: 1}}

    // Facebook 
    // var selector = { 'services.facebook.email': { $exists: true } }
    // var projection = { fields: { profile: 1, services: 1, createdAt: 1 } }

    var users = UserList.find(selector, projection).map(function(user, index){
        // Each account with email I want to get the first item address
        valueLength = function (key) { if (key) { return key.length } else { return 0 } }
        valueBool = function (key) { if (key) { return key } else { return false } }
        var memberObj = {
          name: user.profile.firstName + " " + user.profile.lastName,
          address: user.emails[0].address,
          // address: user.services.facebook.email,
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
  'played': function(){
    var numberOfUsers = Questions.find({}, { limit: 70000, sort: { dateCreated: -1 }, usersAnswered: {_id: 1}}).fetch();
    var list = _.uniq(_.flatten(_.map(numberOfUsers, function(question){
      return question.usersAnswered
    })));
    console.log(list.length)
    // console.log(numberOfUsers)
  },
  'sendTestNewsletter': function(){
    // check(url, String);
    // var deeplink = url;
    var shortlink = HTTP.post("https://api.branch.io/v1/url", {
      "data": {
        "branch_key": "key_live_ppziaDSmTGvzyWPJ66QaqjocuvaXZc9M",
        "data": {
          "$canonical_identifier": "referral",
          "$og_title": "Patriots vs Eagles. Pre Game Pickks!",
          "$og_description": "Before the Game Make Six Predictions to Win Cash!",
          "$desktop_url": "https://pickk.co/?utm_content=referral",
          "$deeplink_path": "/"
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
              nickname: game.home.nickname
            },
            away: {
              shortCode: game.away.abbreviation.toUpperCase(),
              color: "#" + awayColor.hex[0],
              nickname: game.away.nickname
            }
          }
        });
        console.log(games)
        return games
      }
    });
    var entire = {
      preheader: "Invite Friends to Play Pickk!",
      headline: "Play With Friends",
      copyAbove: "Super Bowl is a great time to play with friends and family. Invite them to play Pickk and earn $1 for future contests.",
      buttonText: "Invite Friends",
      gameIds: ['5a70b2c9b5e93ba44fa37d71'],
      url: shortlink.data.url,
      copyBelow: "Watching the game at a party? Create a Super Bowl matchup and challenge your friends & family to Pickk the next play. Play each quarter, one half or the entire game.",
      reason: "You received this email because you created an account in the app.",
    }

    var html = SSR.render('game', entire);

    var text = entire.headline + " " + entire.copyAbove + " " + entire.buttonText + " " + entire.url + " " + entire.copyBelow
    console.log(text)
    
    mg.send({
      from: "Kyle at Pickk<hi@pickk.co>",
      to: listAddress,
      subject: "Earn $1 for Every Friend Referred!",
      text: text,
      html: html
    }, function (error, body) {
      console.log(body);
    });
  },
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