Template.chatRoom.created = function() {
  this.autorun(function() {
    var groupId = Router.current().params._id || Session.get('chatGroup') || null;
    Meteor.subscribe("chatMessages", groupId, Session.get('chatLimit'));
    Meteor.subscribe("chatMessagesCount", groupId);
    Meteor.subscribe('findUsersInGroup', groupId);
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
      var group = Groups.findOne({_id: groupId}, {fields: {name: 1}})
      return group.name
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
            customTemplate: "Not so fast! Please wait " + Math.ceil(error.details.timeToReset / 1000) + " seconds before sending another message.",
            duration: 3000,
            backdrop: true
          })
        }
      });
      $("#messageBox").val('');
    }
  },
  'click [data-action=mention]': function(){
    $("#messageBox").focus()
    $("#messageBox").val("@")
  },  
});

Template.singleMessage.events({
  'click .item': function (e, t) {
    var displayOptions = function ( o ) {
      // The select item dom and data
      var $selected = $(e.currentTarget)
      var selectedObj = o.dataPath
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
      insertedTemplate: Template.chatOptions,
      containerId: "chat-options",
      event: e,
      template: t,
      dataPath: t.data.i
    }
    displayOptions( parms )
  },
});

Template.chatOptions.helpers({
  'options': function ( ) {
    var owner = Template.instance().data.user
    var currentUser = Meteor.userId()
    if ( owner === currentUser || currentUser.role === "admin") {
      return "col-md-25"
    } else {
      return "col-md-33"
    }    
  },
  'canDelete': function (){
    var owner = Template.instance().data.user
    var currentUser = Meteor.userId()
    if ( owner === currentUser || currentUser.role === "admin") {
      return true
    } else {
      return false
    }
  } 
});

Template.chatOptions.events({
  'click [data-action=reply]': function(event, template) {
    var userId = Template.instance().data.user
    var user = Meteor.users.findOne({_id: userId});
    var userName = user.profile.username
    $('[name=messageBox]').val("@" + userName)
    $("#messageBox").focus()
    var container = $('#chat-options')[0]
    container.remove();
  },
  'click [data-ion-popover=_reactionToMessage]': function(){
    var messageId = Template.instance().data._id
    Session.set("reactToMessageId", messageId);
  },
  'click [data-action=user]': function(event, template) {
    var userId = Template.instance().data.user
    Router.go('/user-profile/' + userId);
  },
  'click [data-action=close]': function(event, template) {
    var entire = $(event.currentTarget).parent().css({'display': 'none', 'opacity': '0'})
  },
});

Template.messageBox.helpers({
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

Template.chatRoom.helpers({
  groupMessages: function() {
    var groupId = Session.get('chatGroup');

    var chat = Chat.find({group: groupId}, {sort: {dateCreated: -1}}).fetch();

    // Find the chat messages from this group.
    var chatArray = [];

    // Loop over all the messages and grab the user id. 
    // This is so we can limit the number of users we need to return. 
    for (var i = 0; i < chat.length; i++) {
      var user = chat[i];
      var userId = user.user;
      var userExists = chatArray.indexOf(userId);
      if (userExists == -1) {
        chatArray.push(userId);
      }
    }

    Meteor.subscribe('chatUsers', chatArray);

    return chat
    
  },
  showLoadMore: function() {
    var groupId = Session.get('chatGroup');
    return Chat.find({group: groupId}).fetch().length < Counts.get("chatMessagesCount");
  },
  // messages: function(messageList) {
  //   return messageList
  // },

  // user: function(id) {
  //   var user = UserList.findOne({_id: id});
  //   return user
  // },
  // chatUser: function() {
  //   return this.profile.username;
  // },
});

Template._groupChats.helpers({
  groups: function() {
   var user = Meteor.user()
    if (user.profile.groups) {
      return user.profile.groups
    } else {
      return false
    }
  },
  group: function() {
    var user = Meteor.user()
    if (user.profile.groups) {
      return user.profile.groups
    } else {
      return false
    }
  },
  groupName: function(id) {
    var group = Groups.findOne({_id: id}, {fields: {name: 1}})
    return group
  }
});

Template._groupChats.events({
  'click .group-selector': function() {
    var id = this.id
    Session.set('chatGroup', id)
    IonPopover.hide();
  },
  'click [data-action=no-group]': function(){
    Router.go('/groups')
  } 
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
          customTemplate: "Not so fast! Please wait " + Math.ceil(error.details.timeToReset / 1000) + " seconds before sending another message.",
          duration: 3000,
          backdrop: true
        })
      }
    });
    IonPopover.hide();
    $("#messageBox").val('');
  },
});

Template._reactionToMessage.events({
  'click button': function(event, template) {
    var selected = $(event.currentTarget)
    var message = selected.attr("value")
    var currentUser = Meteor.userId()
    var messageId = Session.get("reactToMessageId");

    Meteor.call('addReactionToMessage', currentUser, message, messageId,  function(error) {
      if (error) {
        IonLoading.show({
          customTemplate: "Not so fast! Please wait " + Math.ceil(error.details.timeToReset / 1000) + " seconds before sending another message.",
          duration: 3000,
          backdrop: true
        })
      }
    });
    IonPopover.hide();
    var container = $('#chat-options')[0]
    container.remove();
    $("#messageBox").val('');
    Session.set("reactToMessageId", null);
  },
});

Template.messageReactions.helpers({
  reactionCount: function () {
    var reactions = this.reactions;
    var reactionCount = [];
    var tempObj = {};

    _.each(reactions, function (val, key) {
      tempObj = {
        reactionName: key,
        count:  val.length
      };
      if (val.length > 0) {
        reactionCount.push(tempObj);
      }
    });
    return reactionCount;
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
