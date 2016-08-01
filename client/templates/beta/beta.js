Template.requestBetaInvite.helpers({
  alreadyRequested: function () {
    var currentUser = Meteor.user()
   	var requested = currentUser.profile.beta_request
    if (requested){
    	return true
    }
  }
});

Template.requestBetaInvite.events({
	'click [data-action=requestInvite]': function () {
    IonLoading.show({
        customTemplate: "<h4>Added to Beta List</h4> We have a limit number of number beta testers spots available. We will add you as soon as a spot opens up!",
        duration: 5000,
        backdrop: true
      });
		Meteor.call('requestBetaInvite')
	}
});