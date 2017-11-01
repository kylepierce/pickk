Template._sharePopover.helpers({
	groups: function () {
		Meteor.subscribe('findThisUsersLeagues', Meteor.userId())
		return Groups.find({})
	}
});

Template._sharePopover.events({
	'click .item': function (e, t) {
		var groupId = this.id
		var groupName = this.name
		var currentUser = Meteor.user();

		if (t.data.type === "coins" || t.data.type === "diamonds"){
			var value = t.data.value
			var message = "I earned " + value + " " + t.data.type + "!"

		} else if (t.data.type === "trophy" || t.data.type === "badge"){
			var message = t.data.message
		}

		if(!groupId){
			groupId = null
			groupName = "Global"
		}

		var chatObj = {
			type: t.data.type,
      user: currentUser._id,
      message: message,
      groupId: groupId,
    }

    Meteor.call('addChatMessage', chatObj, function(error) {
        if (error) {
          IonLoading.show({
            customTemplate: "Not so fast! Please wait " + Math.ceil(error.details.timeToReset / 1000) + " seconds before sending another message.",
            duration: 3000,
            backdrop: true
          })
        } else {
					var data = {
						userId: currentUser._id,
						type: t.data.type,
					}
					if(Meteor.isCordova){
						//Intercom needs unix time with '_at' in JSON to work.
						var intercomData = {
							"shared_notification": true,
							"last_shared_notification_at": parseInt(Date.now() / 1000),
							"userId": currentUser._id,
						}
						updateIntercom(intercomData)
					}
					analytics.track("shared notification",  data)
		      IonLoading.show({
				    customTemplate: '<h3>Shared in ' + groupName +' Chat!</h3>',
				    duration: 1500,
				    backdrop: true
				  });
        }
      });
	  IonPopover.hide()
	}
});
