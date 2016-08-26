Template.notifications.helpers({
	notifications: function () {
		var userId = Meteor.userId();
		var notifications = Notifications.find({userId: userId}).fetch()
		return notifications
	}, 
	noNotifications: function () {
		var numberOfNotifications = this.notifications.length;
		if (numberOfNotifications === 0){
			return true
		}
	}
});

Template.notification.helpers({
	notif: function(type){
		if(this.note.type === type){
			return this.note
		}
	},
	noNotifications: function () {
		var data = Template.instance()
	}
});

Template.groupNotification.helpers({
	user: function(ref) {
		Meteor.subscribe('findSingle', ref);
		return UserList.findOne({_id: ref})
	},
	groupData: function(groupId) {
		Meteor.subscribe('singleGroup', groupId);
		return Groups.findOne({_id: groupId})
	},
});

Template.chatNotification.helpers({
	user: function(ref) {
		Meteor.subscribe('findSingle', ref);
		return UserList.findOne({_id: ref})
	},
	groupData: function(groupId) {
		if (groupId !== undefined){
			Meteor.subscribe('singleGroup', groupId);
			return Groups.findOne({_id: groupId})
		}
	},
	reactions: function(messageId){
		Meteor.subscribe('singleMessage', messageId);
		return Chat.findOne({_id: messageId});
	}
});

Template.chatReaction.helpers({
	user: function(ref) {
		Meteor.subscribe('findSingle', ref);
		return UserList.findOne({_id: ref})
	},
	emojiIconSrc: function (reactionName) {
	 switch(reactionName) {
	   case "dead":
	       return '/emoji/Full-Color/Emoji-Party-Pack-01.svg';
	     break;
	   case "omg":
	       return '/emoji/Full-Color/Emoji-Party-Pack_Artboard%20119.svg';
	     break;
	   case "fire":
	       return '/emoji/Full-Color/Emoji-Party-Pack_Artboard%20119.svg';
	     break;
	   case "dying":
	       return '/emoji/Full-Color/Emoji-Party-Pack-13.svg';
	     break;
	   case "hell-yeah":
	       return '/emoji/Full-Color/Emoji-Party-Pack_Artboard%20109.svg';
	     break;
	   case "what":
	       return '/emoji/Full-Color/Emoji-Party-Pack_Artboard%20112.svg';
	     break;
	   case "pirate":
	       return '/emoji/Full-Color/Emoji-Party-Pack-24.svg';
	     break;
	   case "love":
	       return '/emoji/Full-Color/Emoji-Party-Pack-58.svg';
	     break;
	   case "tounge":
	       return '/emoji/Full-Color/Emoji-Party-Pack-86.svg';
	     break;
	   case "oh-no":
	       return '/emoji/Full-Color/Emoji-Party-Pack-93.svg';
	     break;
	   case "what-the-hell":
	       return '/emoji/Full-Color/Emoji-Party-Pack-96.svg';
	     break;
	 	}
	}
});

Template.trophyNotification.helpers({
	trophy: function (trophyId) {
		return Trophies.findOne({_id: trophyId})
	},
	game: function ( gameId ) {
		return Game.findOne({_id: gameId});
	}
});

Template.newFollower.helpers({
	user: function(ref) {
		Meteor.subscribe('findSingle', ref);
		return UserList.findOne({_id: ref})
	},
});

Template.notification.events({
	'click .item': function (e, t) {
		var displayOptions = function ( o ) {
			// The select item dom and data
			var $selected = $(e.currentTarget)
			var selectedObj = t.data.note
			var templateName = o.insertedTemplate

			var addOptions = function ( id, data ){
				var options = "<div id='" + id + "'></div>"
				$selected.after(options);
				var container = $('#' + id + '')[0]
				Blaze.renderWithData(templateName, data, container)
			}

			var container = $('#' + o.containerId + '')[0]
			if ( container ){
				if ( container.previousSibling !== $selected[0] ){
					container.remove();
					addOptions( o.containerId, selectedObj )	
				} else {
					container.remove();
				}
			} else {
				addOptions( o.containerId, selectedObj )	
			}
		}
		parms = {
			insertedTemplate: Template.notificationOptions,
			containerId: "options",
		 	event: e,
		 	template: t,
		}
		displayOptions( parms )
	},
});

Template.notificationOptions.events({
	'click [data-action=reply]': function (e, t) {
		IonPopover.show('_replyToMessage', t.data, e.currentTarget)
	  var senderId = t.data.senderId
    var user = Meteor.users.findOne({_id: senderId});
    var userName = user.profile.username
    $('[name=messageBox]').val("@" + userName + " ")
    $("#messageBox").focus()
    var container = $('#options')[0]
    container.remove();
	}, 
	'click [data-action=react]': function (e, t) {
		IonPopover.show('_reactionToMessage', t.data, e.currentTarget)
	}, 
	'click [data-action=share]': function (e, t) {
		// Popover to choose where to share
		IonPopover.show('_sharePopover', t.data, e.currentTarget);
	}, 
	'click [data-action=group]': function (e, t) {
		var groupId = t.data.groupId
		Router.go('/groups/' + groupId);
	}, 
	'click [data-action=user]': function (e, t) {
		var userId = t.data.userId
		Router.go('/user-profile/' + userId);
	}, 
	'click [data-action=follow]': function (e, t) {
		var senderId = t.data.senderId
		var sender = Meteor.users.findOne({_id: senderId});
		var username = sender.profile.username
		sAlert.success("Followed " + username + "!" , {effect: 'slide', position: 'bottom', html: true});
		Meteor.call('followUser', Meteor.userId(), senderId)
	}, 
	'click [data-action=read]': function(e, t){
		$('#options').remove();
		var notificationId = t.data._id
		Meteor.call('removeNotification', notificationId);
		sAlert.success("Maked as read" , {effect: 'slide', position: 'bottom', html: true});
	}
});

Template.notificationOptions.helpers({
	options: function(){
		var note = Template.instance().data.type
		var twoOption = ["coins", "diamonds", "badge", "trophy", "chatReaction"] 
		var threeOption = ["follower", "group"]
		var fourOption = ["mention"]

		numberOfOptions = function (array){
			if( array.indexOf(note) !== -1 )
				{return true}
		}

		if(numberOfOptions(fourOption)){
			return "col-md-25"
		} else if (numberOfOptions(threeOption)){
			return "col-md-33"
		} else if (numberOfOptions(twoOption)){}
			return "col-50"
	},
	mention: function (template) {
		var note = Template.instance().data.type
		if(note === "mention"){
			return true
		}
	},
	award: function () {
		var note = Template.instance().data.type
		var types = ["coins", "diamonds", "badge", "trophy"] 
		if(types.indexOf(note) !== -1){
			return true
		}
	},
	interaction: function () {
		var note = Template.instance().data.type
		var types = ["follower", "mention", "group", "chatReaction"] 
		var exists = types.indexOf(note) !== -1
		if(exists){
			return true
		}
	},
	follower: function () {
		var note = Template.instance().data.type
		var types = ["follower"] 
		var exists = types.indexOf(note) !== -1
		if(exists){
			return true
		}		
	},
	notAlreadyFollowing: function () {
    var t = Template.instance()
    var senderId = t.data.senderId
    var following = Meteor.user().profile.following
    var alreadyFollowing = following.indexOf(senderId)
    if(alreadyFollowing === -1 ){
      return true
    }		
	},
	group: function () {
		var note = Template.instance().data.type
		var types = ["group"] 
		var exists = types.indexOf(note) !== -1
		if(exists){
			return true
		}
	},
});

Template.coinsNotification.helpers({
	gameName: function (id) {
		if (id !== undefined){
			Meteor.subscribe('singleGameData', id)
			var game = Games.findOne({_id: id})
			return game
		}
	},
	questionTitle: function (id) {
		Meteor.subscribe('singleQuestion', id)
		var question = Questions.findOne({_id: id});
		return question.que
	}
});