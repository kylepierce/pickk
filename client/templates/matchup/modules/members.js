Template._matchupMembers.helpers({
	users: function () {
		Meteor.subscribe('matchupUsers', this._id)
		var users = this.users
		return UserList.find({_id: {$in: users}}).fetch();
	}
});

Template._matchupMembers.events({
	'click [data-action=viewUser]': function(){
		IonModal.close()
		Router.go('/user-profile/' + this.user._id);
	},
	'click [data-action=delete]': function (e, t) {
		var inviter = Meteor.userId();
		var userId = this.user._id
		var username = this.user.profile.username
		var matchupId = this._id
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
					Meteor.call('removeMatchupMember', userId, matchupId, inviter)
        	 sAlert.success("Removed " + username , {effect: 'slide', position: 'bottom', html: true});
        	return true
        }
      }
    });
	}
});

Template.matchupMemberItem.helpers({
	admin: function(){
		var userId = Meteor.userId();
		if (userId === this.commissioner){
			return true
		}
	}
});
