Template.chatRoom.created = function () {
  this.autorun(function () {
    var groupId = Router.current().params._id
    console.log(groupId)
    this.subscription = Meteor.subscribe('groups', groupId) && 
    Meteor.subscribe('findUserGroups', groupId)
  }.bind(this));
};

Template.chatOverview.events({
  'click #all-chats': function(){
    Session.set('chatGroup', null)
  }
});

Template.chatOverview.helpers({
  group: function(){
    var groupId = Session.get('chatGroup')
    var group = Groups.findOne({_id: groupId}, {fields: {groupId: 1}})
    return group.groupId
  } 
});

Template.chatRoom.events({
  'submit form': function (event) {
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
      Meteor.call('addChatMessage', currentUser, message, groupId);
      $("#messageBox").val('');
    }
  }
});

Template.chatRoom.helpers({
  messages: function () {
    var groupId = Session.get('chatGroup')
    Meteor.subscribe("chatMessages", groupId)
    var chat = Chat.find({group: groupId}, {sort: {dateCreated: -1}, limit: 10}).fetch()
    console.log(chat)
    var chatArray = []
    

    for (var i = 0; i < 9; i++) {
      var user = chat[i].user
      var userExists = chatArray.indexOf(user)
      if(userExists == -1){
        chatArray.push(user)
        console.log(chatArray)
      }
    };
    Session.set('chatArray', chatArray);
    Meteor.subscribe('chatUsers', chatArray)
    return chat 
  },
  user: function(id){
    var user = UserList.findOne({_id: id});
    return user
  },
  chatUser: function(){ 
    var twitter = this.services.twitter
    if(twitter){
      return twitter.screenName
    } else {
      return this.profile.username
    }
  },
  chatAvatar: function(user){
  if (user.services.twitter !== undefined){
    var photo = user.services.twitter.profile_image_url
    var cleanPhoto = photo.replace('_normal', '')
    return cleanPhoto;
  } else if (user.services.facebook !== undefined) {
    avatar = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=square&height=500&width=500";
    return avatar;
  } else {
    return "/anon.png"
  }
  },
  userCoins: function(){
    return this.profile.coins
  },
  'randomMessage': function(){
    var random = Math.floor((Math.random() * 5) + 1)
    if (random == 1){
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
  group: function(){
    var user = Meteor.user()
    return user.profile.groups
  },
  groupName: function(id){
    var group = Groups.findOne({_id: id}, {fields: {groupId: 1}})
    return group 
  }
});

Template._groupChats.events({
  'click .group-selector': function () {
    var id = this.id
    Session.set('chatGroup', id)
    IonPopover.hide();
  },
});

