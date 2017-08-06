Template.wagers.rendered = function () {
  var wagerArray = [50, 500, 2500]
  var lastWager = Session.get('lastWager');
  var position = wagerArray.indexOf(lastWager)
  var wager = $('[value=' + lastWager + ']' ).click();
  $('#wagers').show();
};

Template.wagers.helpers({
  wagers: function () {
    var wagerArray = [50, 500, 2500]
    return wagerArray
  }
});
