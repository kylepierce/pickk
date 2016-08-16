Template._sharePopover.helpers({
	groups: function () {
		Meteor.subscribe('findThisUsersGroups', Meteor.userId())
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
			var message = "+!Meow" + "I earned " + value + " " + t.data.type + "!"

		} else if (t.data.type === "trophy" || t.data.type === "badge"){
			var message = "+!Meow" + t.data.message
			console.log("Trophy or badge")
		}

		if(!groupId){
			groupId = null
			groupName = "Global"
		} 
	  var chatObj = {
      user: currentUser, 
      message: message, 
      groupId: groupId
    }
    Meteor.call('addChatMessage', chatObj, function(error) {
        if (error) {
          IonLoading.show({
            customTemplate: "Not so fast! Please wait " + Math.ceil(error.details.timeToReset / 1000) + " seconds before sending another message.",
            duration: 3000,
            backdrop: true
          })
        } else {
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