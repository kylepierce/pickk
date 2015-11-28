// Template.sideMenuContent.helpers({
// 	photo: function () {
// 		currentUser = Meteor.user();

// 	   if (currentUser.services.twitter){
// 			var photo = currentUser.services.twitter.profile_image_url
// 			var cleanPhoto = photo.replace('_normal', '')
// 			return cleanPhoto;
// 	   } if (currentUser.services.facebook) {
//             avatar = "http://graph.facebook.com/" + currentUser.services.facebook.id + "/picture/?type=square&height=500&width=500";
//             console.log(avatar);
//             return avatar;
//         } else {
//     	return "photo.jpg"
//     }
// 	}	
// });



var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

Template.mainView.rendered = function() {
  // IonSideMenu.snapper.settings({disable: 'right'});  
  IonSideMenu.snapper.settings({touchToDrag: true});
};

Template.sideMenuContent.events({
  'click [data-action=logout]': function () {
    AccountsTemplates.logout();
	}
});

Template.mainView.events({
  'click [data-action=refresh]': function () {
    Fetcher.refresh('leaderboard')
  },
  'click [data-action=refresh-week]': function () {
    Fetcher.refresh('weekLeaderboard')
  }
});

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
    Meteor.subscribe('findSingle', id)
    console.log(id)
    var user = UserList.findOne({_id: id});
    console.log(user)
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