Template.wagers.rendered = function () {
  var wagerArray = [50, 500, 2500]
  var lastWager = Session.get('lastWager');
  var position = wagerArray.indexOf(lastWager)
  var wager = $('[value=' + lastWager + ']' ).click();
  // $('#wagers').css('display', 'flex');
};

Template.wagers.helpers({
  wagers: function () {
    var wagerArray = [50, 500, 2500]
    return wagerArray
  }
});

Template.wagers.events({
  'click [data-action=wager-selected]': function () {
    var lastWager = Session.set('lastWager', this.w);
  }
});
