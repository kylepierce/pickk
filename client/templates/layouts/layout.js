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
  IonSideMenu.snapper.settings({touchToDrag: false});
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
