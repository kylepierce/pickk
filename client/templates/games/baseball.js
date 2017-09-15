Template.gameInProgressInfo.helpers({
  baseball: function () {
    var football = this.game && this.game.football
    if (!football){
      return true
    }
  },
  border: function(){
    // console.log(this);
    if(this.border === false){
      return "no-border"
    }
  },
});

Template.outDisplay.helpers({
  outsCount: function(number){
    if (number === 0){
      return "<div class='no-out'></div> <div class='no-out'></div> <div class='no-out'></div>"
    } else if(number === 1){
      return "<div class='out'></div> <div class='no-out'></div> <div class='no-out'></div>"
    } else if (number === 2) {
      return "<div class='out'></div> <div class='out'></div> <div class='no-out'></div>"
    } else if (number === 3){
      return "<div class='out'></div><div class='out'></div><div class='out'></div>"
    }
  }
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
