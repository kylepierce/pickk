Template.notifications.onCreated(function() {
  var filter = Router.current().params.query.filter
  var read = Router.current().params.query.read
  var userPref = Meteor.user().profile.notifications
  var all = ["group", "mention", "follower", "coins", "diamonds", "leaderboard", "badge", "trophy"]
  // There was existing data saved and it fucks up the status because it only filtered by type. This resets it.
  if(userPref && !userPref.type){
    var userPref = {
      type: all,
      status: [true, false]
    }
  }
  var data = {
		userId: Meteor.userId()
	}
  if(read){
    var read = read.toLowerCase();
    if (read === "true"){
      data.status = [true]
    } else if (read === "false"){
      data.status = [false]
    }
  } else if (userPref) {
    data.status = userPref.status
    Session.set('notificationsFilter', userPref);
  }  else {
    data.status = [true, false]
  }

  if(filter){
    var filter = filter.toLowerCase();
    if(filter === "all"){
      data.type = all
      Session.set('notificationsFilter', data);
    } else if(filter){
      data.type = [filter]
      Session.set('notificationsFilter', data);
    }
  } else if (userPref) {
    data.type = userPref.type
    Session.set('notificationsFilter', data);
  } else {
    data.type = all
    Session.set('notificationsFilter', data);
  }
  var self = this;

  self.getFilter = function () {
    return Session.get('notificationsFilter');
  };
  self.autorun(function () {
    self.subscribe('userNotifications', self.getFilter(), function () {
      $(".loader-holder").delay(500).fadeOut('slow', function () {
        $(".loading-wrapper").fadeIn('slow');
      });
    });
  });
});

Template.notifications.onRendered(function () {
	$("svg").delay(250).fadeIn();
});

Template.notifications.helpers({
	filters: function () {
		var data = Session.get('notificationsFilter');
		var types = data.type
		var status = data.status
		status.push.apply(status, types);
		var list = _.map(status, function(type, i){
		  var type = type.toString();
		  if (type === "true"){
		    status[i] = "Read"
		  } else if (type === "false"){
		    status[i] = "Unread"
		  } else {
		    var cap = type.charAt(0).toUpperCase() + type.substring(1)
		    status[i] = cap
			}
			return status[i]
		});
		return list
	},
	notifications: function () {
		var userId = Meteor.userId();
    var existing = Template.instance().data.user.profile.notifications
		var notifications = Notifications.find().fetch()
		return notifications
	},
	noNotifications: function () {
		var numberOfNotifications = this.notifications.length;
		if (numberOfNotifications === 0){
			return true
		}
	}
});

Template.notification.onRendered(function () {
	$('#list-of-notifications li').each(function (i) {
		var t = $(this);
		setTimeout(function () {
			t.addClass('animated fadeInUp');
			t.removeClass('hidden')
		}, (i + 1) * 150 );
	});
});

Template.notification.helpers({
	notif: function(type){
		if(this.note.type === type){
			return this.note
		}
	},
	noNotifications: function () {
		var data = Template.instance()
	},
  new: function(){
    if(this.note.read === false){
      return "history-inprogress"
    }
  }
});

Template.leagueNotification.helpers({
	user: function(ref) {
		Meteor.subscribe('findSingle', ref);
		return UserList.findOne({_id: ref})
	},
	leagueData: function(leagueId) {
		Meteor.subscribe('singleGroup', leagueId);
		return Groups.findOne({_id: leagueId})
	},
  status: function(status){
    if(status){
      return status
    }
  }
});

Template.leagueNotification.events({
  // 'click [data-action=viewGroup]': function(e, t){
  //   Router.go('/groups/' + this.note.groupId);
  // }
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
  'click [data-action=viewLeague]': function(e, t){
    Router.go('/league/' + this.note.leagueId);
  },
  'click [data-action=viewUser]':function(e, t){
    var userId = t.data.note.senderId
    if (userId){
      Router.go('/user-profile/' + userId);
    } else {
      Router.go('/user-profile/' + this.userId);
    }
  }
	// 'click .item': function (e, t) {
	// 	var displayOptions = function ( o ) {
	// 		// The select item dom and data
	// 		var $selected = $(e.currentTarget)
	// 		var selectedObj = t.data.note
	// 		var templateName = o.insertedTemplate
  //
	// 		var addOptions = function ( id, data ){
	// 			var options = "<div id='" + id + "'></div>"
	// 			$selected.after(options);
	// 			var container = $('#' + id + '')[0]
	// 			Blaze.renderWithData(templateName, data, container)
	// 		}
  //
	// 		var container = $('#' + o.containerId + '')[0]
	// 		if ( container ){
	// 			if ( container.previousSibling !== $selected[0] ){
	// 				container.remove();
	// 				addOptions( o.containerId, selectedObj )
	// 			} else {
	// 				container.remove();
	// 			}
	// 		} else {
	// 			addOptions( o.containerId, selectedObj )
	// 		}
	// 	}
	// 	parms = {
	// 		insertedTemplate: Template.notificationOptions,
	// 		containerId: "options",
	// 	 	event: e,
	// 	 	template: t,
	// 	}
	// 	displayOptions( parms )
	// },
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
	// 'click [data-action=group]': function (e, t) {
	// 	var groupId = t.data.groupId
	// 	Router.go('/groups/' + groupId);
	// },
	'click [data-action=user]': function (e, t) {
		var senderId = t.data.senderId
		Router.go('/user-profile/' + senderId);
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
		var twoOption = ["matchup", "coins", "diamonds", "badge", "trophy", "chatReaction"]
		var threeOption = ["follower", "group"]
		var fourOption = ["mention"]

		numberOfOptions = function (array){
			if( array.indexOf(note) !== -1 ){return true}
		}

		if(numberOfOptions(fourOption)){
			return "col-md-25"
		} else if (numberOfOptions(threeOption)){
			return "col-md-33"
		} else if (numberOfOptions(twoOption)){
			return "col-50"
		}
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
	// group: function () {
	// 	var note = Template.instance().data.type
	// 	var types = ["group"]
	// 	var exists = types.indexOf(note) !== -1
	// 	if(exists){
	// 		return true
	// 	}
	// },
});

Template.coinsNotification.onCreated(function () {
	this.subscribe('singleQuestion', this.data.note.questionId);
	this.subscribe('singleGameData', this.data.note.gameId);
	// this.subscribe()
});

Template.coinsNotification.helpers({
	gameName: function (id) {
		if (id !== undefined){
			var game = Games.findOne({_id: id})
			return game
		}
	},
	questionTitle: function () {
		var question = Questions.findOne({ _id: this.note.questionId});
		var que = question && question.que
		if ( que ){
			return question.que
		}
	}
});

Template.matchupNotification.helpers({
	user: function(ref) {
		Meteor.subscribe('findSingle', ref);
		return UserList.findOne({_id: ref})
	},
  status: function(status){
    if(status){
      return status
    }
  }
});

Template.matchupNotification.events({
  'click [data-action=viewMatchup]': function(e, t){
    Router.go('/matchup/' + this.note.matchupId);
  }
});
