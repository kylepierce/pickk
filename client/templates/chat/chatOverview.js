Template.chatRoom.created = function() {
  this.autorun(function() {
    var groupId = Router.current().params._id || Session.get('chatGroup') || null;
    Meteor.subscribe("chatMessages", groupId, Session.get('chatLimit'));
    Meteor.subscribe("chatMessagesCount", groupId);
    Meteor.subscribe('groups', groupId);
    Meteor.subscribe('findUserGroups', groupId);
    Meteor.subscribe('chatUsersList', groupId);
  }.bind(this));
};

Template.chatRoom.onRendered( function() {
  $( "svg" ).delay( 0 ).fadeIn();
});

Template.chatRoom.onCreated( function() {
  this.subscribe( 'chatUsersList', function() {
    $( ".loader" ).delay( 1000 ).fadeOut( 'fast', function() {
      $( ".loading-wrapper" ).fadeIn( 'fast' );
    });
  });
});

Template.chatOverview.events({
  'click #all-chats': function() { 
    Session.set('chatGroup', null)

  },
  'click .load-more': function() {
    Session.set('chatLimit', Session.get('chatLimit') + 10)
  }
});

Template.chatOverview.helpers({
  group: function() {
    var groupId = Session.get('chatGroup')
    if (groupId) {
      var group = Groups.findOne({_id: groupId}, {fields: {groupId: 1}})
      return group.groupId
    }
  }
});

Template.chatRoom.events({
  'submit form': function(event) {
    event.preventDefault();
    var currentUser = Meteor.userId()
    var groupId = Session.get('chatGroup')
    var message = event.target.messageBox.value;

    if (message.length <= 2) {
      IonLoading.show({
        customTemplate: 'Message is too short',
        duration: 1500,
        backdrop: true
      });
    } else if (message.length >= 151) {
      IonLoading.show({
        customTemplate: "<h4>Ain't Nobody Got Time for Your Novel.</h4> ;) Shorten Your Messsage! (Think Twitter Length)",
        duration: 1500,
        backdrop: true
      });
    } else {
      Meteor.call('addChatMessage', currentUser, message, groupId, function(error) {
        if (error) {
          IonLoading.show({
            customTemplate: error.reason ,
            duration: 3000,
            backdrop: true
          })
        }
      });
      $("#messageBox").val('');
    }
  },
  'click [data-action=reply]': function(event, template) {
  },
  'click [data-action=react]': function(event, template) {
  },
  'click [data-action=user]': function(event, template) {
    Router.go('/user-profile/' + this.user);
  },
  'click [data-action=close]': function(event, template) {
    var entire = $(event.currentTarget).parent().css({'display': 'none', 'opacity': '0'})
  },
  'click #single-message ': function(event, template) {
    var entire = $(event.currentTarget).siblings().css({'display': 'block', 'opacity': '1'})
  },
});

Template.chatRoom.helpers({
  settings: function() {
    return {
      position: "bottom",
      limit: 5,
      rules: [
        {
          token: '@',
          collection: "UserList",
          subscription: "chatUsersAutocomplete",
          sort: true,
          field: "profile.username",
          template: Template.userPill,
          noMatchTemplate: Template.noMatch
        }
      ]
    };
  },
  groupMessages: function() {
    var groupId = Session.get('chatGroup');

    // Find the chat messages from this group.
    var chat = Chat.find({group: groupId}, {sort: {dateCreated: -1}}).fetch()

    var chatArray = []

    // Loop over all the messages and grab the user id. 
    // This is so we can limit the number of users we need to return. 
    for (var i = 0; i < chat.length; i++) {

      var user = chat[i]
      var userId = user.user
      var userExists = chatArray.indexOf(userId)
      if (userExists == -1) {
        chatArray.push(userId)
      }
    }

    Meteor.subscribe('chatUsers', chatArray);

    return chat
  },
  showLoadMore: function() {
    var groupId = Session.get('chatGroup');
    return Chat.find({group: groupId}).fetch().length < Counts.get("chatMessagesCount");
  },
  messages: function(messageList) {
    return messageList
  },
  message: function() {
    return this.message.replace(/(@[^\s]+)/g, "<strong>$1</strong>");
  },
  user: function(id) {
    var user = UserList.findOne({_id: id});
    return user
  },
  chatUser: function() {
    if (this.services && this.services.twitter && this.services.twitter.screenName) {
      return this.services.twitter.screenName
    } else {
      return this.profile.username
    }
  },
  userCoins: function() {
    return this.profile.coins
  },
  'randomMessage': function() {
    var random = Math.floor((Math.random() * 5) + 1)
    if (random == 1) {
      return 'Share your score'
    } else if (random == 2) {
      return 'Share your prediction'
    } else if (random == 3) {
      return 'Say Hello :D'
    } else if (random == 4) {
      return 'Who is your favorite team?'
    } else if (random == 5) {
      return 'Who will win?'
    }
  }
});

Template._groupChats.helpers({
  group: function() {
    var user = Meteor.user()
    if (user.profile.groups) {
      return user.profile.groups
    } else {
      return false
    }
  },
  groupName: function(id) {
    var group = Groups.findOne({_id: id}, {fields: {groupId: 1}})
    return group
  }
});

Template._groupChats.events({
  'click .group-selector': function() {
    var id = this.id
    Session.set('chatGroup', id)
    IonPopover.hide();

  },
});

Template._reaction.events({
  'click button': function(event, template) {
    var selected = $(event.currentTarget)
    var message = selected.attr("value")
    var currentUser = Meteor.userId()
    var groupId = Session.get('chatGroup')
    Meteor.call('addChatMessage', currentUser, message, groupId, function(error) {
      if (error) {
        IonLoading.show({
          customTemplate: error.reason ,
          duration: 3000,
          backdrop: true
        })
      }
    });
    IonPopover.hide();
    $("#messageBox").val('');
  },
});

