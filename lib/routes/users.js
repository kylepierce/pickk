Router.route('/friends', {
  template: 'friends',
  fastRender: true,
  subscriptions: function() {
    return Meteor.subscribe('userList');
  },
});  

Router.route('/inviteFriend', function(){
  this.render('inviteFriend');
});  

Router.route('/searchUsers', {
  template: 'searchUsers',
  fastRender: true,
  subscriptions: function() {
    // return Meteor.subscribe('userList');
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/profile', {
  template: 'myProfile',
  subscriptions: function() {
    return Meteor.subscribe('trophy');
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/user-profile/:_id', function(){
  this.layout('userProfile', {
    data: {
      user: Meteor.users.findOne({_id: this.params._id}),
      trophies: Trophy.find({}),
      groups: Groups.find({})
    },
  });
  this.subscribe('findSingle', this.params._id)
  this.subscribe('findUsersInGroup', this.params._id)
}, {
  name: 'user.show',
  controller: 'authenticatedController',
  fastRender: true,
  subscriptions: function(){
    return Meteor.subscribe('trophy')
  }
});