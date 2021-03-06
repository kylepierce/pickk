Template.chatRoom.rendered = function() {
  var userId = Meteor.userId();
  // Meteor.subscribe('findThisUsersLeagues', Meteor.userId())
};

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
      var group = Groups.findOne({_id: groupId}, {fields: {name: 1}});
      if (group) {
        return group.name
      }
    }
  }
});

Template.singleMessage.helpers({
  type: function (type) {
    if(this.i.type === type){
      return this
    }
  },
  award: function () {
    var awardTypes = ["coins", "diamonds", "trophy"]
    var award = awardTypes.indexOf(this.i.type)
    if(award >= 0){
      return true
    }
  },
  emojiIconSrc: function (item) {
    var reactionName = item.i.reaction
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

Template.chatOptions.helpers({
  'options': function ( ) {
    var currentUser = Meteor.user()
    if ( currentUser.profile.role === "admin") {
      return "col-md-25"
    } else {
      return "col-md-33"
    }
  },
  'notOwnMessage': function (){
    var owner = Template.instance().data.i.user
    var currentUser = Meteor.userId()
    var userIsAdmin = Meteor.user().profile && Meteor.user().profile.role
    if ( owner !== currentUser || userIsAdmin === "admin") {
      return true
    } else {
      return false
    }
  },
  'canDelete': function (){
    var owner = Template.instance().data.i.user
    var currentUser = Meteor.userId()
    var userIsAdmin = Meteor.user().profile.role
    var groupId = Session.get("chatGroup");
    var group = Groups.findOne({_id: groupId});
    if (group && currentUser === group.commissioner){
      return true
    } else if ( owner === currentUser || userIsAdmin === "admin") {
      return true
    } else {
      return false
    }
  }
});

Template.chatOptions.events({
  'click [data-action=reply]': function(event, template) {
    var userId = Template.instance().data.i.user
    var user = Meteor.users.findOne({_id: userId});
    var userName = user.profile.username
    var messageBox = $("#messageBox")
    messageBox.focus();
    messageBox.val('');
    messageBox.val("@" + userName + " ");
    analytics.track('Respond to message', {
      opId: userId,
      opName: userName,
      replier: Meteor.userId()
    });
  },
  'click [data-action=react]': function(e, t){
    IonPopover.show('_reactionToMessage', t.data, e.currentTarget)
  },
  'click [data-action=user]': function(event, template) {
    var userId = Template.instance().data.i.user
    Router.go('/user-profile/' + userId);
  },
  'click [data-action=delete]': function(event, template) {
    var deletor = Meteor.userId();
    var userId = Template.instance().data.i.user
    var messageId = Template.instance().data.i._id
    analytics.track('Delete Message', {
      opId: userId,
      deletor: Meteor.userId()
    });
    Meteor.call('deleteMessage', messageId, deletor)
  },
});

Template.messageBox.events({
  'keyup textarea': function(e, t){
    e.preventDefault();
    // Check if the message is longer than 3 characters
    var length = e.currentTarget.value.length
    if (length < 3){
      $('#chat-submit').removeClass('allow-chats')
    } else if ( length >= 4){
      // If its long enough make the submit box light up.
      $('#chat-submit').addClass('allow-chats')
    }

    // If the user uses the return button submit the chat.
    if (e.which == 13 && ! e.shiftKey) {
      var currentUser = Meteor.userId()
      // There are two places to submit chats
      if (this.type === "mention"){
        var groupId = this.groupId
      } else {
        var groupId = Session.get('chatGroup')
      }

      var message = e.currentTarget.value;
      var chatObj = {
        user: currentUser,
        message: message,
        groupId: groupId
      }
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
        Meteor.call('addChatMessage', chatObj, function(error) {
          if (error) {
            IonLoading.show({
              customTemplate: "Not so fast! Please wait " + Math.ceil(error.details.timeToReset / 1000) + " seconds before sending another message.",
              duration: 3000,
              backdrop: true
            })
          } else {
            IonKeyboard.close()
            $('#chat-submit').removeClass('allow-chats')
            $("#messageBox").val('');
            IonLoading.show({
              customTemplate: "Posting.",
              duration: 3000,
              backdrop: true
            })

          }
        });
      }
    }
  },
  'submit form': function(e, t) {
    e.preventDefault();
    var currentUser = Meteor.userId()
    // There are two places to submit chats
    if (this.type === "mention"){
      var groupId = this.groupId
    } else {
      var groupId = Session.get('chatGroup')
    }
    var message = e.target.messageBox.value;
    var chatObj = {
        user: currentUser,
        message: message,
        groupId: groupId
      }

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
      Meteor.call('addChatMessage', chatObj, function(error) {
        if (error) {
          IonLoading.show({
            customTemplate: "Not so fast! Please wait " + Math.ceil(error.details.timeToReset / 1000) + " seconds before sending another message.",
            duration: 3000,
            backdrop: true
          })
        } else {
          IonKeyboard.close()
          // IonPopover.hide()
          $('#chat-submit').removeClass('allow-chats')
          $("#messageBox").val('');
          IonLoading.show({
            customTemplate: "Posting.",
            duration: 3000,
            backdrop: true
          });
        }
      });
    }
  },
  'click [data-action=mention]': function(){
    $("#messageBox").focus()
    var currentMessage = $("#messageBox").val()
    $("#messageBox").val(currentMessage + " @")
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
    Meteor.subscribe("chatMessagesCount", null);
    var groupId = Session.get('chatGroup');
    var chatLimit = Session.get('chatLimit');
    if(!groupId){
      var groupId = null
    }
    Meteor.subscribe("chatMessages", groupId, chatLimit);
    Meteor.subscribe('chatUsersList', chatLimit, groupId);
    var chat = Chat.find({group: groupId}, {sort: {dateCreated: -1}}).fetch();
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
    IonPopover.hide();
    IonSideMenu.snapper.close();
    Router.go('/leagues')
  }
});

Template._reaction.events({
  'click button': function(e, t) {
    var selected = $(e.currentTarget)
    var message = selected.attr("value")
    var currentUser = Meteor.userId()
    var groupId = Session.get('chatGroup')
    var chatObj = {
      user: currentUser,
      reaction: message,
      groupId: groupId,
      type: "reaction"
    }

    Meteor.call('addChatMessage', chatObj, function(error) {
      if (error) {
        IonLoading.show({
          customTemplate: "Not so fast! Please wait " + Math.ceil(error.details.timeToReset / 1000) + " seconds before adding another reaction.",
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
  'click button': function(e, t) {
    var currentUser = Meteor.userId()
    var message = e.currentTarget.value
    var messageId = t.data.i._id

    analytics.track("react to message", {
      messageId: messageId,
      userId: currentUser,
      reaction: message
    });

    Meteor.call('addReactionToMessage', currentUser, message, messageId,  function(error) {
      if (error) {
        IonLoading.show({
          customTemplate: "Not so fast! Please wait " + error + " seconds before sending another message.",
          duration: 3000,
          backdrop: true
        })
      }
    });
    IonPopover.hide();
    $("#messageBox").val('');
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
