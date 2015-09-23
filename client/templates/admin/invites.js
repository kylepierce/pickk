Meteor.subscribe('invitees');

Template.invites.helpers({
	invite: function () {
	return Invites.find({ invited: false }, {sort: {"requested": 1}}, {fields: {"_id": 1, "inviteNumber": 1, "requested": 1, "email": 1, "invited": 1}}).fetch()
	},
	requested: function() {
		return moment.unix(this.requested / 1000).format("MMMM Do, YYYY");
	},
	count: function() {
		return Invites.find({ invited: false }, {fields: {"invited": 1}}).count()
	}
});


Template.invites.events({
	'click [data-action=invite]': function(){
		var invitee = { id: this._id, email: this.email}

		return Meteor.call('sendInvite', invitee, function(error){
			if (error) {
         return console.log(error);
      } else {
         return alert("Invite sent to " + invitee.email + "!");
      }
		})
	}
})