Template._groupRequests.created = function() {
	IonPopover.hide();
};

Template._groupRequests.helpers({
	user: function () {
    var groupId = Session.get('groupId');
    var group = Groups.findOne({_id: groupId});
		return group.requests
	},
	userDetails: function(userId){
		Meteor.subscribe('findSingleUsername', userId)
		return UserList.findOne({_id: userId})
	},

});

Template._groupRequests.events({
	'click [data-action=accept]': function(){
		var groupId = Session.get('groupId');
		var user = this._id
		Meteor.call('acceptRequest', groupId, user)
	}, 
	'click [data-action=delete]': function(){
		var groupId = Session.get('groupId');
		var user = this._id
		Meteor.call('denyRequest', groupId, user)
	},
}); 