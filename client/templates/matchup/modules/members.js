Template.matchupMembers.helpers({
	users: function () {
		var users = this.matchup[0].users
		return UserList.find({_id: {$in: users}}).fetch();
	}
});

Template.matchupMembers.events({
	'click [data-action=viewUser]': function(){
		Router.go('/user-profile/' + this._id);
	},
	'click [data-action=delete]': function (e, t) {
		var inviter = Meteor.userId();
		var userId = this.user._id
		var username = this.user.profile.username
		var matchupId = this.matchup[0]._id
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
    var matchup = this.matchup[0]
		if (userId === matchup.commissioner){
			return true
		}
	}
});
