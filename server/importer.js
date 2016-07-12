Meteor.methods({
  getPlayerInfo: function (playerId, team) {
    // Request the page
    result = Meteor.http.get("http://espn.go.com/mlb/player/stats/_/id/"+playerId);
    
    // Create object to store player info
    playerInfo = {"playerId": playerId, "team": team};
    
    // Use cheerio to parse it
    $ = cheerio.load(result.content);
    var team = team

    function oneLine (text, career){
      // Setup some temp objects
      playerInfo.stats = {}
      playerInfo.stats.y2016 = {}
      playerInfo.stats.career = {}

      // From the text we are going to find where to start and end
      var year2016 = text.indexOf('2016') // Find 2016 in the stats
      var totals = text.indexOf('Total') // Find career total in the stats
      var seasons = text.indexOf('Season Averages') // Where to end after career stats 
      var firstDigit = text.search(/\d/) // Index of first digit
      var text2016 = text.slice((firstDigit), (totals)) // 2016 Stats
      var seasons = text.slice((totals+6), (seasons)) // Career Stats
      var text2016 = text2016.split('\n'); // Remove the line break
      var seasons = seasons.split('\n'); // Remove the line break
      var statsArray = ["ab", "r", "h", "double", "triple", "hr", "rbi", "bb", "so", "sb", "cs", "avg", "obp", "slg", "ops", "war"]

      for (var i = 0; i <= 15; i++) {
        var statName = statsArray[i]
        var stat = seasons[i+1] 
        if(stat == "--" || stat == undefined || stat == null) {
          var stat = 0 
        } else {
          var stat = parseFloat(seasons[i+1]) 
        } 
        playerInfo.stats.career[statName] = stat
      }

      for (var i = 0; i <= 15; i++) {
        var statName = statsArray[i]
        var stat = text2016[i+1] 
        if(stat == "--" || stat == undefined || stat == null) {
          var stat = 0 
        } else {
          var stat = parseFloat(text2016[i+1]) 
        } 
        playerInfo.stats.y2016[statName] = stat
      }
    }

    // Get the player's name
    $('h1', '.mod-content').each(function(){
      var name = $(this).text()
      playerInfo.name = name
    });

    // Get players general info like number, side they bat, what side they throw, and their position.
    $('.general-info ', '.mod-content').each(function(){
      var general = $(this).text()
      var number = general.slice(0,3)
      var bats = general.indexOf('Bats:')
      var throws = general.indexOf('Throws:')
      var batOrThrow = Math.min(throws, bats)

      var bats = general.slice((bats + 6), (bats + 7))
      var throws = general.slice((throws+8), (throws+9))
      var position = general.slice(4,batOrThrow)

      playerInfo.number = number
      playerInfo.bats = bats
      playerInfo.throws = throws
      playerInfo.position = position
    });

    // Find the stats table in string format and put it into a variable
    var general = $('.tablehead', '.mod-container')
    var text = general.text()

    // Parse the players text to add to temp objects
    var year2016 = text.indexOf('2016')
    var seasons = text.indexOf('Season Averages')
    var text2016 = text.slice((year2016+4), (seasons))
    
    oneLine(text2016, true)

    // Create easy to refrence variables
    var stats = playerInfo.stats
    var position = playerInfo.position

    // Check to see if the player already exists
    var player = Players.findOne({"playerId": playerId });
    if(player){
      console.log("Player Already Exists")

      Players.update({"_id": player._id}, {
        $set: {
          'stats': stats,
          'position': position,
          'team': team,
        }
      });
     } else {
        Players.insert(playerInfo);  
     }
  },

  updateMlbId: function (playerId, mlbId){
    var player = Players.findOne({"playerId": playerId });

    Players.update({"_id": player._id}, {
      $set: {
        'mlbId': mlbId,
      }
    });
  },

  'getExtend2016Info': function ( playerId ) {
    result = Meteor.http.get("http://espn.go.com/mlb/player/splits/_/id/" + playerId + "/year/2016/");
    $ = cheerio.load(result.content); 
    // Players.findOne({playerId: playerId})
    var countStats = {}
    var statsArray = ["ab", "r", "h", "double", "triple", "hr", "rbi", "bb", "hbp", "so", "sb", "cs", "avg", "obp", "slg", "ops"]
  
    // Find the stats table in string format and put it into a variable
    var general = $('.tablehead .oddrow')
    var text = general.map(function() {

      var $row = $(this);
     
      var row = {};
      for (var i = 0; i < statsArray.length - 1; i++) {
        var statName = statsArray[i]
        var numberFix = i+2
        row[statName] = $row.find(':nth-child(' + numberFix +')').text()
      }
      var name = $row.find(':nth-child(1)').text()
      var name = name.replace(/[^A-Z0-9]+/ig, "_");
      var name = name.toLowerCase();
      countStats[name] = row
    }).get();

    var general = $('.tablehead .evenrow')
    var text = general.map(function() {

      var $row = $(this);
     
      var row = {};
      for (var i = 0; i < statsArray.length - 1; i++) {
        var statName = statsArray[i]
        var numberFix = i+2
        var statValue = $row.find(':nth-child(' + numberFix +')').text()
        row[statName] = statValue
      }
      var name = $row.find(':nth-child(1)').text()
      var name = name.replace(/[^A-Z0-9]+/ig, "_");
      var name = name.toLowerCase();
      countStats[name] = row
    }).get();    

    var player = Players.findOne({"playerId": playerId });
    if(player){
      console.log("Player Already Exists")

      Players.update({"_id": player._id}, {
        $set: {
          'stats.y2016extended': countStats,
        }
      });
     } else {
        console.log("Player doesnt exist yet")
     }
  },

  'getExtendPlayerInfo': function ( playerId ) {
    result = Meteor.http.get("http://espn.go.com/mlb/player/splits/_/id/" + playerId + "/type/batting3/");
    $ = cheerio.load(result.content); 
    // Players.findOne({playerId: playerId})
    var countStats = {}
    var statsArray = ["ab", "r", "h", "double", "triple", "hr", "rbi", "bb", "hbp", "so", "sb", "cs", "avg", "obp", "slg", "ops"]
  
    // Find the stats table in string format and put it into a variable
    var general = $('.tablehead .oddrow')
    var text = general.map(function() {

      var $row = $(this);
     
      var row = {};
      for (var i = 0; i < statsArray.length - 1; i++) {
        var statName = statsArray[i]
        var numberFix = i+2
        row[statName] = $row.find(':nth-child(' + numberFix +')').text()
      }
      var name = $row.find(':nth-child(1)').text()
      var name = name.replace(/[^A-Z0-9]+/ig, "_");
      var name = name.toLowerCase();
      countStats[name] = row
    }).get();

    var general = $('.tablehead .evenrow')
    var text = general.map(function() {

      var $row = $(this);
     
      var row = {};
      for (var i = 0; i < statsArray.length - 1; i++) {
        var statName = statsArray[i]
        var numberFix = i+2
        var statValue = $row.find(':nth-child(' + numberFix +')').text()
        row[statName] = statValue
      }
      var name = $row.find(':nth-child(1)').text()
      var name = name.replace(/[^A-Z0-9]+/ig, "_");
      var name = name.toLowerCase();
      countStats[name] = row
    }).get();    

    var player = Players.findOne({"playerId": playerId });
    if(player){
      console.log("Player Already Exists")

      Players.update({"_id": player._id}, {
        $set: {
          'stats.three_year': countStats,
        }
      });
     } else {
        console.log("Player doesnt exist yet")
     }
  },

  createATeam: function ( fullName, nickname, computerName, city, state) {
    Teams.insert({
      "fullName": fullName,
      "nickname": nickname,
      "computerName": computerName,
      "city": city,
      "state": state
    });
  },

  findMLBIds: function(mlbCode){
    var url = "http://m." + mlbCode + ".mlb.com/roster/40-man/"
    result = Meteor.http.get(url)
    mlbId = []

    function cleanName(name){
      var name = name.replace(/(\r\n|\n|\r)/gm,"");
      var name = name.split('(')[0]
      return name
    }

    function parseMLBPlayer(url) {
      // Example: /player/455759/chris-young
      var removeEspn = url.replace('/player/', '')
      var lastDash = removeEspn.indexOf('/')
      var playerId = removeEspn.slice(0,lastDash)
      return playerId
    }

    $ = cheerio.load(result.content);
    $($('td[class=dg-name_display_first_last]')).each(function(){
      var url = $(this).find("a").attr('href')
      var playerName = $(this).text()
      var playerName = cleanName(playerName)
      var playerId = parseMLBPlayer(url)
      mlbId.push({"playerName": playerName, "playerId": playerId, "url": url})
    })
    return mlbId
  },

  // Find all the players on the time and create/update the players 
  findPlayersOnTeam: function (computerName, mlbId) {
    var team = Teams.findOne({"computerName": computerName});

    // Get the player unique id
    function parsePlayer(url) {
      var removeEspn = url.replace('http://espn.go.com/mlb/player/_/id/', '')
      var lastDash = removeEspn.indexOf('/')
      var playerId = removeEspn.slice(0,lastDash)
      return playerId
    }

    function findMlbObj(name, array) {
      // (!) Cache the array length in a variable
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i].playerName === name)
          return array[i]; // Return as soon as the object is found
      }
      console.log(name + " was not found")
      return null; // The searched object was not found
    }

    // Find the team url based on the two or three letter code
    var teamUrl = 'http://espn.go.com/mlb/team/stats/batting/_/name/' + team.computerName
    var teamId = team._id
    result = Meteor.http.get(teamUrl)
    var teamInfo = [];
    $ = cheerio.load(result.content);

    // Grab every player
    // This can refactored
    $('.oddrow a', '#my-players-table').each(function(){
      var url = $(this).attr('href')
      var name = $(this).text()
      var playerId = parsePlayer(url)
      teamInfo.push({"name": name,"playerId": playerId, "url": url})
    })
    $('.evenrow a', '#my-players-table').each(function(){
      var url = $(this).attr('href')
      var name = $(this).text()
      var playerId = parsePlayer(url)
      teamInfo.push({"name": name,"playerId": playerId, "url": url})
    })
    var allIds = Meteor.call('findMLBIds', team.mlbCode)
    // Create / Update them
    for (var i = teamInfo.length - 1; i >= 0; i--) {
      Meteor.call('getPlayerInfo', teamInfo[i].playerId, teamId)
      Meteor.call('getExtend2016Info', teamInfo[i].playerId)
      Meteor.call('getExtendPlayerInfo', teamInfo[i].playerId)
      // Find matching player
      var name = teamInfo[i].name
      var mlb = findMlbObj(name, allIds)
      if(mlb === null){
        continue;
      } else {
        console.log(mlb.playerName + " " + mlb.playerId)
        Meteor.call('updateMlbId', teamInfo[i].playerId, mlb.playerId)
      }
    }
    console.log("All Done! :D")
  },

//   findAllPlayers: function (id) {
//     var team = Teams.findOne({"_id": id});
//     for (var i = team.players.length - 1; i >= 0; i--) {
//       Meteor.call('getPlayerInfo', team.players[i].playerId, id)
      
//     }
//     console.log("All Done! :D")
//   }
})