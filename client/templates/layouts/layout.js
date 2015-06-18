Template.sideMenuContent.helpers({
	photo: function () {
		currentUser = Meteor.user();

	   if (currentUser.services.twitter){
			var photo = currentUser.services.twitter.profile_image_url
			var cleanPhoto = photo.replace('_normal', '')
			return cleanPhoto;
	   } if (currentUser.services.facebook) {
            avatar = "http://graph.facebook.com/" + currentUser.services.facebook.id + "/picture/?type=square&height=500&width=500";
            console.log(avatar);
            return avatar;
        } else {
    	return "photo.jpg"
    }
	}	
});

Template.mainView.rendered = function() {
  IonSideMenu.snapper.settings({disable: 'right'});
};

Template.sideMenuContent.events({
  'click [data-action=logout]': function () {
    AccountsTemplates.logout();
	},
    'click [data-action=toggleMenu]': function(){
        $(div.loginArea).toggleClass ("hidden-account", false);
    }
});

Meteor.subscribe('leaderboard');

settings = {
    dragger: false,
    disable: 'right',
    addBodyClasses: true,
    hyperextensible: false,
    resistance: 1,
    flickThreshold: 50,
    transitionSpeed: 0.5,
    easing: 'ease',
    maxPosition: 260,
    minPosition: -260,
    tapToClose: true,
    touchToDrag: false,
    slideIntent: 40,
    minDragDistance: 5
}

var snapper = new Snap({
  element: document.getElementById('fa-bars')
});

document.body.addEventListener("ontouchstart", function(event) {
  if(document.getElementByClass("snap-drawer").scrollTop > 0) return;
  event.preventDefault();
  event.stopPropagation();
}, false);