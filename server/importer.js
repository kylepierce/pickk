Meteor.methods({
  getPlayerInfo: function (playerId, team) {
    result = Meteor.http.get("http://espn.go.com/mlb/player/stats/_/id/"+playerId);
    playerInfo = {"playerId": playerId, "team": team};
    $ = cheerio.load(result.content);
    var team = team

    function oneLine (text, career){
      playerInfo.stats = {}
      playerInfo.stats.y2016 = {}
      playerInfo.stats.career = {}

      var year2016 = text.indexOf('2016')
      var seasons = text.indexOf('Season Averages')
      var totals = text.indexOf('Total')

      var text2016 = text.slice((year2016+6), (totals))
     
      var seasons = text.slice((totals+6), (seasons))
      
      var text2016 = text2016.split('\n');
      var seasons = seasons.split('\n');
      var statsArray = ["AB", "R", "H", "Double", "Triple", "HR", "RBI", "BB", "SO", "SB", "CS", "AVG", "OBP", "SLG", "OPS", "WAR"]


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

    function parsePlayerStats (text){
      var year2016 = text.indexOf('2016')
      var seasons = text.indexOf('Season Averages')
      var totals = text.indexOf('Total')

      var text2016 = text.slice((year2016+6), (seasons))
      oneLine(text2016, true)
    }

    $('h1', '.mod-content').each(function(){
      var name = $(this).text()
      playerInfo.name = name
    });

    $('.general-info ', '.mod-content').each(function(){
      var general = $(this).text()
      var number = general.slice(0,3)
      var bats = general.indexOf('Bats:')
      var throws = general.indexOf('Throws:')
      var batOrThrow = Math.min(throws, bats)
      console.log(batOrThrow)

      var bats = general.slice((bats + 6), (bats + 7))
      var throws = general.slice((throws+8), (throws+9))
      var position = general.slice(4,batOrThrow)

      playerInfo.number = number
      playerInfo.bats = bats
      playerInfo.throws = throws
      playerInfo.position = position
    });

    var general = $('.tablehead', '.mod-container')
    var text = general.text()
    parsePlayerStats(text)

    var player = Players.findOne({"playerId": playerId });
    var y2016Stats = playerInfo.stats.y2016
    var careerStats = playerInfo.stats.career
    var position = playerInfo.position

     if(player){
        console.log("Player Already Exists")

        Players.update({"_id": player._id}, {
          $set: {
            'stats.y2016': y2016Stats,
            'stats.career': careerStats,
            'position': position,
            'team': team,
            // 'stats.y2016.R': y2016Stats.R,
            // 'stats.y2016.H': y2016Stats.H,
            // 'stats.y2016.Double': y2016Stats.Double,
            // 'stats.y2016.Triple': y2016Stats.Triple,
            // 'stats.y2016.HR': y2016Stats.HR,
            // 'stats.y2016.RBI': y2016Stats.RBI,
            // 'stats.y2016.BB': y2016Stats.BB,
            // 'stats.y2016.SO': y2016Stats.SO,
            // 'stats.y2016.SB': y2016Stats.SB,
            // 'stats.y2016.CS': y2016Stats.CS,
            // 'stats.y2016.AVG': y2016Stats.AVG,
            // 'stats.y2016.OBP': y2016Stats.OBP,
            // 'stats.y2016.SLG': y2016Stats.SLG,
            // 'stats.y2016.OPS': y2016Stats.OPS,
            // 'stats.y2016.WAR': y2016Stats.WAR
          }
        });
     } else {
        Players.insert(playerInfo);  
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

  findPlayersOnTeam: function (computerName) {
    var team = Teams.findOne({"computerName": computerName});

    function parsePlayer(url) {
      var removeEspn = url.replace('http://espn.go.com/mlb/player/_/id/', '')
      var lastDash = removeEspn.indexOf('/')
      var playerId = removeEspn.slice(0,lastDash)
      return playerId
    }

    console.log(team)
    var teamUrl = 'http://espn.go.com/mlb/team/stats/batting/_/name/' + team.computerName
    console.log(teamUrl)
    var teamId = team._id
    result = Meteor.http.get(teamUrl)
    var teamInfo = [];
    $ = cheerio.load(result.content);
    $('.oddrow a', '#my-players-table').each(function(){
      var url = $(this).attr('href')
      var playerId = parsePlayer(url)
      teamInfo.push({"playerId": playerId, "url": url})
    })
    $('.evenrow a', '#my-players-table').each(function(){
      var url = $(this).attr('href')
      var playerId = parsePlayer(url)
      teamInfo.push({"playerId": playerId, "url": url})
    })

    for (var i = teamInfo.length - 1; i >= 0; i--) {
      console.log(teamInfo[i].playerId)
      Meteor.call('getPlayerInfo', teamInfo[i].playerId, teamId)
    }
    console.log("All Done! :D")
  },

  findAllPlayers: function (id) {
    var team = Teams.findOne({"_id": id});
    console.log(team)
    for (var i = team.players.length - 1; i >= 0; i--) {
      console.log(team.players[i].playerId)
      Meteor.call('getPlayerInfo', team.players[i].playerId, id)
    }
    console.log("All Done! :D")
  }
})