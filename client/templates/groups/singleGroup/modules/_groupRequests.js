Template._groupRequests.created = function() {
	IonPopover.hide();
};

Template._groupRequests.helpers({
	user: function () {
    var groupId = this.group[0]._id
    var group = Groups.findOne({_id: groupId});
		return group.requests
	},
	userDetails: function(userId){
		Meteor.subscribe('findSingleUsername', userId)
		return UserList.findOne({_id: userId})
	},

});

Template._groupRequests.events({
	'click [data-action=accept]': function(e, t){
		var groupId = t.data.group[0]._id
		var user = this._id
		var commissionerUserId = Meteor.userId();
		Meteor.call('acceptRequest', groupId, user, commissionerUserId)
	},
	'click [data-action=delete]': function(e, t){
		var groupId = t.data.group[0]._id
		console.log(this, e, t);
		var user = this._id
		Meteor.call('denyRequest', groupId, user)
	},
});
