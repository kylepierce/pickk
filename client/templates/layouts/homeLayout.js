Template.homeLayout.rendered = function() {
  // IonSideMenu.snapper.settings({disable: 'right'});  
  IonSideMenu.snapper.settings({touchToDrag: false});
};

Template.chatLayout.rendered = function() {
  // IonSideMenu.snapper.settings({disable: 'right'});  
  IonSideMenu.snapper.settings({touchToDrag: false});
};

// Template.sideMenuRight.onRendered = function () {
//   var waypoint = new Waypoint({
//   element: document.getElementById('chat-top'),
//   handler: function(direction) {
//     console.log('Scrolled to waypoint!')
//   }
// })
// };

Template.chatHeader.events({
  'click': function(event, template){
    event.preventDefault();
    console.log("Loading up something awesome")
  }
})

Template.sideMenuContent.helpers({
	userId: function () {
		return Meteor.userId();
	},
  connected: function() {
    if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
      return Meteor.status().connected;
    } else {
      return true;
    }
  },
  admin: function() {
    var currentUser = Meteor.user();
    return currentUser && currentUser.profile.role === "admin";
  }
});
