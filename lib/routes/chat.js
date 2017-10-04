// Router.route('/chatOverview',{
//   template: 'chatOverview',
//   layoutTemplate: 'chatLayout',
//   data: function () {
//   },
//   onBeforeAction: function() {
//     return this.next();
//   }
// });
//
// Router.route('/chatRoom',{
//   template: 'chatRoom',
//   layoutTemplate: 'chatLayout',
// });
//
// Router.route('/chat/:id', {
//   template: 'chatRoom',
//   name: 'chat.show',
//   layoutTemplate: 'chatLayout',
//   waitOn: function() {
//     return [
//       Meteor.subscribe('chatMessages', null, 10),
//       Meteor.subscribe("chatMessagesCount", null)
//     ]
//   },
//   data: function () {
//     groupId: null
//   },
//   onBeforeAction: function() {
//     return this.next();
//   }
// });
