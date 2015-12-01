Template._removeUser.created = function() {
	IonPopover.hide();
};

Template._removeUser.helpers({
	user: function () {
    var groupId = Session.get('groupId');
    var group = Groups.findOne({_id: groupId});
		return group.members
	},
	userDetails: function(userId){
		return UserList.findOne({_id: userId}, {sort: {"profile.username": -1}})
	},
	admin: function(userId){
		var groupId = Session.get('groupId');
    var group = Groups.findOne({_id: groupId});
		if (userId != group.commissioner){
			return true
		}
	}
});

Template._removeUser.events({
	'click [data-action=delete]': function (event, template) {
		var id = this._id
		var user = UserList.findOne({_id: id});
		var username = user.profile.username
		var groupId = Session.get('groupId');
		IonActionSheet.show({
      titleText: 'Are You Sure You Remove User?',
      buttons: [
        { text: 'Remove User <i class="icon ion-share"></i>' },
      ],
      destructiveText: '',
      cancelText: 'Cancel', 
      cancel: function() {

      },
      buttonClicked: function(index) {
        if (index === 0) {
					console.log(id)
					Meteor.call('removeGroupMember', id, groupId)
        	 sAlert.success("Removed " + username , {effect: 'slide', position: 'bottom', html: true});
        	return true
        }
      }
    });
	}
}); 