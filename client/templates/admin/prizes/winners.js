Template.manageWinners.helpers({
  winners: function(){
    Meteor.subscribe('winners', { paid: false });
    return Winnings.find({}, {sort: {dateCreated: -1}}).fetch();
  },
});

Template.manageWinners.events({
  'click [data-action=viewWinnings]': function(e, t){
    IonModal.open('_winnerModal', this);
  }
});

Template.winnerItem.helpers({
  user: function (userId) {
    return UserList.findOne({ _id: userId });
  }
});

Template._winnerModal.helpers({
  placeGrammer: function(place){
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
  periodName: function(period){
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
  winnings: function(userId){
    Meteor.subscribe('winningsByUser', userId);
    Meteor.subscribe('winners', {userId: userId});
    return Winnings.find({userId: userId});
  }
});

Template._winnerModal.events({
  'click [data-action=paid]': function (e, t) {
    Meteor.call('paidUser', t.data.userId);
  }
});