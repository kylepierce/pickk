Template.dailyPickks.rendered = function () {
  var now = moment();
  var dateSpelled = moment(now,"MM/DD/YYYY", true).format("MMM Do YYYY");
  var title = dateSpelled + " Predictions"
  var game = Games.findOne({name: title})
  var gameId = game._id
  Meteor.subscribe('singleGame', gameId)
  Meteor.subscribe('gameNotifications', gameId)
};

Template.dailyPickks.helpers({
  questionsExist: function () {
    var currentUserId = Meteor.userId()
    var selector = {active: true, usersAnswered: {$nin: [currentUserId]}}
    return Questions.find(selector).count()
  },
	dailyPickks: function () {
    var currentUserId = Meteor.userId()
    var selector = {active: true, usersAnswered: {$nin: [currentUserId]}}
		return Questions.find(selector, {limit: 1}).fetch();
	},
  scoreMessage: function() {
    
    var user = Meteor.userId();
    var notifications = Notifications.find({userId: user, read: false});

    notifications.forEach(function(post) {
      var id = post._id
      if (post.type === "diamonds" && post.read === false) {
        message = '<img style="height: 40px;" src="/diamonds.png"> <p class="diamond"> ' + post.message + '</p>'

        Meteor.call('removeNotification', id);

        sAlert.warning(message, {effect: 'stackslide', html: true});
      } 
    });
  }
});

Template.dailyPickks.events({
	'click [data-action=play-selected]': function (e, t) {
    $('.play-selected').removeClass('play-selected ten-spacing')
    $(e.currentTarget).addClass('play-selected ten-spacing')
    var displayOptions = function ( o ) {
      // The select item dom and data
      var $selected = $(e.currentTarget)
      var selectedObj = o.dataPath
      var templateName = o.insertedTemplate

      var addOptions = function ( id, data ){
        var options = "<div id='" + id + "'></div>"
        $selected.after(options);
        var container = $('#' + id + '')[0]
        Blaze.renderWithData(templateName, data, container)
      }

      var container = $('#' + o.containerId + '')[0]
      if ( container ){
        if ( container.previousSibling !== $selected[0] ){
          container.remove();
          addOptions( o.containerId, selectedObj )  
        } else {
          container.remove();
        }
      } else {
        addOptions( o.containerId, selectedObj )  
      }
    }
    parms = {
      insertedTemplate: Template.submitButton,
      containerId: "submit",
      event: e,
      template: t,
      dataPath: this,
    }
    displayOptions( parms )
  },
}); 