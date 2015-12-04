// Template.chatRoom.created = function () {
//   this.autorun(function () {
//     var groupId = Router.current().params._id
//     console.log(groupId)
//     this.subscription = Meteor.subscribe('groups', groupId) && 
//     Meteor.subscribe('findUserGroups', groupId)
//   }.bind(this));
// };

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
    return chat 
  },
  user: function(id){
    Meteor.subscribe('chatUser', id)
    var user = UserList.findOne({_id: id});
    return user
  },
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

