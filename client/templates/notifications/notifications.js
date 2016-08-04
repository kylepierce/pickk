Template.notifications.helpers({
	notifications: function () {
		var userId = Meteor.userId();
		var notifications = Notifications.find({userId: userId}).fetch()
		return notifications
	}, 
});

Template.notification.helpers({
	item: function(type){
		if(this.note.type === type){
			return this.note
		}
	},
});

Template.notifications.events({
	'click [data-action=delete]': function () {
		var notificationId = this._id
		Meteor.call('removeNotification', notificationId);
	},
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

Template.groupNotification.events({
	'click [data-action=delete]': function () {
		var notificationId = this.note._id
		Meteor.call('removeNotification', notificationId);
	}
});

Template.chatNotification.helpers({
	user: function(ref) {
		Meteor.subscribe('findSingle', ref);
		return UserList.findOne({_id: ref})
	},
	groupData: function(groupId) {
		Meteor.subscribe('singleGroup', groupId);
		return Groups.findOne({_id: groupId})
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
			containerId: "notification-options",
		 	event: e,
		 	template: t,
		}
		displayOptions( parms )
	},
});

Template.notificationOptions.events({
	'click [data-action=user]': function (event, template) {
		var note = template.data.data.note
		console.log(note.senderId)
	}, 
	'click [data-action=close]': function(){
		$('#notification-options').remove();
	}
});

Template.notificationOptions.helpers({
	options: function(){
		var note = Template.instance().data.type
		var twoOption = ["score", "diamonds", "badge", "trophy"] 
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
		var types = ["score", "diamonds", "badge", "trophy"] 
		if(types.indexOf(note) !== -1){
			return true
		}
	},
	interaction: function () {
		var note = Template.instance().data.type
		var types = ["follower", "mention", "group"] 
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
	group: function () {
		var note = Template.instance().data.type
		var types = ["group"] 
		var exists = types.indexOf(note) !== -1
		if(exists){
			return true
		}
	},
});



