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
		return UserList.findOne({_id: userId})
	},

});

Template._groupRequests.events({

}); 