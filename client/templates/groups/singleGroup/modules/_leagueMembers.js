Template._leagueMembers.helpers({
	users: function () {
		var users = this.group[0].members
		return UserList.find({_id: {$in: users}}).fetch();
	}
});

Template._leagueMembers.events({
	'click [data-action=viewUser]': function(){
		Router.go('/user-profile/' + this.user._id);
	},
	'click [data-action=delete]': function (e, t) {
		var inviter = Meteor.userId();
		var userId = this.user._id
		var username = this.user.profile.username
		var groupId = this.group[0]._id
		IonActionSheet.show({
      titleText: 'Are You Sure You Want To Remove This User?',
      buttons: [
        { text: 'Remove User <i class="icon ion-share"></i>' },
      ],
      destructiveText: '',
      cancelText: 'Cancel',
      cancel: function() {

      },
      buttonClicked: function(index) {
        if (index === 0) {
					Meteor.call('removeGroupMember', userId, groupId, inviter)
        	 sAlert.success("Removed " + username , {effect: 'slide', position: 'bottom', html: true});
        	return true
        }
      }
    });
	}
});

Template.memberItem.helpers({
	admin: function(){
		var userId = Meteor.userId();
    var group = this.group[0]
		if (userId === group.commissioner){
			return true
		}
	}
});
