Template.history.onCreated(function() {
  this.subscribe('userData');
  this.subscribe('gamesPlayed');
  this.autorun(function(computation) {
    if (Template.instance().subscriptionsReady()) {
      $(".loader").delay(100).fadeOut('fast', function() {
        $(".loading-wrapper").fadeIn('fast');
      });
      computation.stop()
    }
  })
});

Template.history.onRendered(function() {
  $("svg").delay(0).fadeIn();
});

Template.history.helpers({
  gamesPlayed: function() {
    var selector = {users: Meteor.userId()};
    return Games.find(selector, {sort: {dateCreated: -1}});
  }
});
