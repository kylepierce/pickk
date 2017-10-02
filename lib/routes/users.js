Router.route('/user-profile/:_id', {
  name: 'user.show',
  template: 'userProfile',
  waitOn: function() {
    var userId = this.params._id
    return [
      Meteor.subscribe('userProfile', userId),
      Meteor.subscribe('trophy'),
      Meteor.subscribe('findThisUsersGroups', userId)
    ]
  },
  data: function () {
    return {
      user: UserList.findOne({_id: this.params._id})
    }
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/friends', {
  template: 'friends',

  subscriptions: function() {
    return Meteor.subscribe('userList');
  },
});

Router.route('/inviteFriend', function(){
  this.render('inviteFriend');
});

Router.route('/searchUsers', {
  template: 'searchUsers',

  subscriptions: function() {
  },
  onBeforeAction: function() {
    return this.next();
  }
});
