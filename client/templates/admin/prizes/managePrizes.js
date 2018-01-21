AutoForm.addHooks(['updatePrize'], {
  onSuccess: function (insertDoc, updateDoc, currentDoc) {
    this.event.preventDefault();
    sAlert.success("Updated Prize!", { effect: 'slide', position: 'bottom', html: true });
    IonModal.close();
  }
});

// AutoForm.addHooks(['toggleStatus'], {
//   onSuccess: function (insertDoc, updateDoc, currentDoc) {
//     this.event.preventDefault();
//     console.log(insertDoc, updateDoc, currentDoc);
//     // sAlert.success("Updated Prize!", { effect: 'slide', position: 'bottom', html: true });
//     // IonModal.close();
//   }
// });

Template.managePrizes.helpers({
	prizes: function(){
    Meteor.subscribe('allPrizes');
    return Prizes.find({}, {sort: {dateCreated: -1}}).fetch();
  },
  status: function(active){
    if(active){
      return "ON"
    } else {
      return "OFF"
    }
  },
  dateEnd: function (time) {
    var end = Chronos.moment(time)
    var current = Chronos.moment()
    var clock = end.diff(current, "seconds");
    var duration = moment.duration(clock, 'seconds');
    var base = duration._data
    var time = base.days + " Days " + base.hours + " Hours " + base.minutes + " Mins " + base.seconds + " Seconds"
    return { icon: "stopwatch", title: time }
  },
  groupData: function () {
    return Prizes.findOne({ _id: this.id })
  }
});

Template.managePrizes.events({
  'click [data-action=edit]': function(e, t){
    var prize = {id: e.currentTarget.id}
    IonModal.open('_editPrizeModal', prize);
  },
  'click [data-action=activate]': function (e, t) {
    var prize = { id: e.currentTarget.id }
    Meteor.call('togglePrizeActive', prize.id, true);
  },
  'click [data-action=deactivate]': function (e, t) {
    var prize = { id: e.currentTarget.id }
    Meteor.call('togglePrizeActive', prize.id, false);
  },
  
});

Template._editPrizeModal.helpers({
  groupData: function () {
    return Prizes.findOne({_id: this.id})
  }
});