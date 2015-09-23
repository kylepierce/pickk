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
  IonSideMenu.snapper.settings({disable: 'right'});  
};

Template.sideMenuContent.events({
  'click [data-action=logout]': function () {
    AccountsTemplates.logout();
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
    if (admin){
      return true
    }
  }
});