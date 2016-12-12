Template.homeLayout.rendered = function() {
  // IonSideMenu.snapper.settings({disable: 'right'});
  IonSideMenu.snapper.settings({touchToDrag: false});

Template.chatLayout.rendered = function() {
  // IonSideMenu.snapper.settings({disable: 'right'});
  IonSideMenu.snapper.settings({touchToDrag: false});
};

// Template.sideMenuRight.onRendered = function () {
//   var waypoint = new Waypoint({
//   element: document.getElementById('chat-top'),
//   handler: function(direction) {
//   }
// })
// };

Template.chatHeader.events({
  'click': function(event, template){
    event.preventDefault();
  }
})
