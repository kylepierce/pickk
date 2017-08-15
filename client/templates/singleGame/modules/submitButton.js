Template.submitButton.helpers({
  'live': function() {
    var connection = Meteor.status()
    var status = connection.status

    if (status == "connected") {
      return true
    } else {
      return false
    }
  },
  // 'potential': function (e, t){
    // var multiplier = this.o.multiplier;
    // console.log(this, e, t);
  //   if (!multiplier){
  //     return false
  //   } else if(this.t === "prediction"){
  //     var wager = 5
  //     var winnings = parseInt(wager * multiplier)
  //     return winnings + " diamonds"
  //   } else {
  //     var wager = this.w
  //     var winnings = parseInt(wager * multiplier)
  //     return winnings
  //   }
  // }
});

Template.submitButton.events({


});
