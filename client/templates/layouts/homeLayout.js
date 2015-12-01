Template.homeLayout.rendered = function() {
  // IonSideMenu.snapper.settings({disable: 'right'});  
  IonSideMenu.snapper.settings({touchToDrag: false});
};

Template.sideMenuRight.onRendered = function () {
  var waypoint = new Waypoint({
  element: document.getElementById('chat-top'),
  handler: function(direction) {
    console.log('Scrolled to waypoint!')
  }
})
};

Template.sideMenuRight.events({
  'submit form': function (event) {
    event.preventDefault();
    var currentUser = Meteor.userId()
    var message = event.target.messageBox.value;
    
    if (message.length <= 2) {
      IonLoading.show({
        customTemplate: 'Message is too short',
        duration: 1500,
        backdrop: true
      });
    } else if (message.length >= 151) {
      IonLoading.show({
        customTemplate: "<h4>Ain't Nobody Got Time for Your Novel.</h4> ;) Shorten Your Messsage! (Think Twitter Length)",
        duration: 1500,
        backdrop: true
      });
    } else {
      Meteor.call('addChatMessage', currentUser, message);
      $("#messageBox").val('');
    }
  }
});

Template.sideMenuRight.helpers({
  message: function () {
    Meteor.subscribe("chatMessages")
    var chat = Chat.find({}, {sort: {dateCreated: -1}, limit: 10}).fetch()
    return chat 
  },
  user: function(id){
    Meteor.subscribe('chatUser', id)
    var user = UserList.findOne({_id: id});
    return user
  }
});

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
    var admin = currentUser.profile.role 
    if (admin === "admin"){
      return true
    }
  }
});