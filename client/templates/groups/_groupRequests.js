Template._groupRequests.created = function() {
	IonPopover.hide();
};

Template._groupRequests.helpers({
	user: function () {
    var groupId = Session.get('groupId');
    var group = Groups.findOne({_id: groupId});
    console.log(group.requests)
		return group.requests
	},
	userDetails: function(userId){
		console.log(userId)
		return UserList.findOne({_id: userId})
	},

});

Template._groupRequests.events({

}); 