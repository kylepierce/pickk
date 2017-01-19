// Router.route('/groups/:_id', function(){
//   this.render('singleGroup'),
//   this.subscribe('singleGroup', this.params._id)
// }, {
//   name: 'group.show',
//   template: 'singleGroup',
//   layoutTemplate: 'homeLayout',
//
//   subscriptions: function(){
//     return [
//       Meteor.subscribe('trophy'),
//       Meteor.subscribe('groupUsers', this.params._id)
//     ]
//   }
// });

Router.route('/groups', {
  template: 'groups',

  subscriptions: function() {
    // Fix next
    Meteor.subscribe('findThisUsersGroups', Meteor.userId())
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/allGroups', {
  template: 'allGroups',

  subscriptions: function() {
    // Will have to find a better way
    return Meteor.subscribe('groups');
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/newgroup', {
  template: 'newGroup',
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/groups/:_id/', {
  name: 'group.show',
  template: 'singleGroup',
  layoutTemplate: 'homeLayout',
  waitOn: function () {
    var userId = Meteor.userId();
    var groupId = this.params._id
    return [
      Meteor.subscribe('singleGroup', groupId),
      Meteor.subscribe('trophy'),
      Meteor.subscribe('groupUsers', groupId)
    ]
  },
  data: function () {
    return {
      group: Groups.find({_id: this.params._id }).fetch()
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});

Router.route('/groups/week-leaderboard/:groupId', {
  template: 'week-leaderboard',
  layoutTemplate: "notificationLayout",
  yieldRegions: {
    'weekFilter': {to: 'filter'},
    'backButton': {to: 'header'}
  },
  waitOn: function() {
    return [
      Meteor.subscribe('userData')
    ]
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/groups/association/:_id', {
  template: 'leagueAssociation',
  layoutTemplate: 'homeLayout',
  waitOn: function () {
    var userId = Meteor.userId();
    var groupId = this.params._id
    return [
      Meteor.subscribe('singleGroup', groupId),
      Meteor.subscribe('groupUsers', groupId),
    ]
  },
  data: function () {
    return {
      group: Groups.find({_id: this.params._id }).fetch()
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});

Router.route('/groups/members/:_id/', {
  template: '_groupMembers',
  waitOn: function () {
    var userId = Meteor.userId();
    var groupId = this.params._id
    return [
      Meteor.subscribe('singleGroup', groupId),
      Meteor.subscribe('groupUsers', groupId),
    ]
  },
  data: function () {
    return {
      group: Groups.find({_id: this.params._id }).fetch()
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});

Router.route('/groups/invite/:_id', {
  template: 'inviteToGroup',
  yieldRegions: {
    'backButton': {to: 'header'}
  },
  subscriptions: function() {
    return Meteor.subscribe('singleGroup', this.params._id);
  },
  data: function() {
    return this.params;
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/groups/new/invite/:_id', {
  template: 'inviteToGroup',
  yieldRegions: {
    'skip': {to: 'header'}
  },
  subscriptions: function() {
    return Meteor.subscribe('singleGroup', this.params._id);
  },
  data: function() {
    return this.params;
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/searchGroups', {
  onBeforeAction: function() {
    return this.next();
  }
});
