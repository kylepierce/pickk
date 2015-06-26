Template.sideMenuContent.events({
  'click [data-action=logout]': function () {
    AccountsTemplates.logout();
	},
    'click [data-action=toggleMenu]': function(){
        $(div.loginArea).toggleClass ("hidden-account", false);
    }
});

Template.sideMenuContent.helpers({
	userId: function () {
		return Meteor.userId();
	}
});