Router.route('/chatOverview',{
  template: 'chatOverview',
  layoutTemplate: 'chatLayout'
});

Router.route('/chatRoom',{
  template: 'chatRoom',
  layoutTemplate: 'chatLayout'
});

Router.route('/chat/:_id', {
  template: 'chatRoom',
  name: 'chat.show',
  layoutTemplate: 'chatLayout',
  controller: 'authenticatedController',
  waitOn: function() {
  },
  data: function () {
  },
  onBeforeAction: function() {
    return this.next();
  }
});