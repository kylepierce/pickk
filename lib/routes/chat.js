Router.route('/chatOverview',{
  template: 'chatOverview',
  layoutTemplate: 'chatLayout',
  controller: "AuthController",
  waitOn: function() {
    return [
      Meteor.subscribe('usersGroups', Meteor.userId)
    ]
  },
  data: function () {
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/chatRoom',{
  template: 'chatRoom',
  layoutTemplate: 'chatLayout',
  controller: "AuthController",
});

Router.route('/chat/:id', {
  template: 'chatRoom',
  name: 'chat.show',
  layoutTemplate: 'chatLayout',
  controller: "AuthController",
  waitOn: function() {
    return [
      Meteor.subscribe('chatMessages', this.params.id, 10)
    ]
  },
  data: function () {
    groupId: "this.params.id"
  },
  onBeforeAction: function() {
    return this.next();
  }
});