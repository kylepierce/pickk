Template.gameInProgressInfo.helpers({
  baseball: function () {
    var football = this.game && this.game.football
    if (!football){
      return true
    }
  }
});

Template.outDisplay.helpers({
  outs: function (number) {
    var out = "<div class='out'></div>"
    var noOut = "<div class='no-out'></div>"

    var repeat = function (s, n) {
      return --n ? s + ("") + repeat(s, n) : "" + s;
    };

    if (number === 0) {
      return repeat(noOut, 3)
    } else if (number === 3) {
      return repeat(out, 3)
    }  else {
      var diff = Math.abs(number - 3)
      var outs = repeat(out, number)
      var noOuts = repeat(noOut, diff)
      return outs + noOuts
    }
  },
});

Template.inningDisplay.helpers({
  grammer: function (inning) {
    if([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].indexOf(inning) >= 0) {
      var inningGrammer = inning + "th"
    } else if ([1].indexOf(inning) >= 0) {
      var inningGrammer = inning + "st"
    } else if ([2].indexOf(inning) >= 0) {
      var inningGrammer = inning + "nd"
    } else if ([3].indexOf(inning) >= 0) {
      var inningGrammer = inning + "rd"
    }
    return inningGrammer
  },
  position: function(data){
    if(data === "Top"){
      return true
    }
  }
});

Template.playersOnBase.helpers({
  empty: function(bases){
    if(bases.length === 0){
      return true
    }
  },
  playerOnBase: function (number, base) {
    if(base && base.length > 0){
      for (var i = 0; i < 2; i++) {
        if (base[i] && base[i].baseNumber === number){
          return true
        }
      }
    }
  },
});
