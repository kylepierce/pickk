// Template.manageWinners.helpers({
//   winners: function () {
//     Meteor.subscribe('winners', {});
//     return Winnings.find({}, { sort: { dateCreated: -1 } }).fetch();
//   },
// });

// Template.manageWinners.events({
//   'click [data-action=viewWinnings]': function (e, t) {
//     IonModal.open('_winnerModal', this);
//   }
// });

Template.viewWinnings.helpers({
  user: function(){
    return Meteor.user()
  },
  amount: function(){
    var userId = Meteor.userId();
    var count = Winnings.find({_id: userId}).count();
    if(count > 0){
      return Winnings.findOne({ _id: userId }).winnings
    } else {
      return 0
    }
  },
  placeGrammer: function (place) {
    switch (place) {
      case 1:
        return place + "st"
        break;
      case 2:
        return place + "nd"
        break;
      case 3:
        return place + "rd"
        break;
      default:
        return place + "th"
        break;
    }
  },
  periodName: function (period) {
    switch (period) {
      case 0:
        return "Pre-Game"
        break;
      case 1:
        return period + "st Quarter"
        break;
      case 2:
        return period + "nd Quarter"
        break;
      case 3:
        return period + "rd Quarter"
        break;
      default:
        return period + "th Quarter"
        break;
    }
  },
  winnings: function () {
    var userId = Meteor.userId();    
    return Winnings.find({ userId: userId });
  }
});