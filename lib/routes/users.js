Router.route('/user-profile/:_id', {
  name: 'user.show',
  template: 'userProfile',
  waitOn: function() {
    return [
      Meteor.subscribe('userProfile', this.params._id),
      Meteor.subscribe('trophy'),
      Meteor.subscribe('findThisUsersGroups', Meteor.userId())
    ]
  },
  data: function () {
    return {
      user: Meteor.users.findOne({_id: this.params._id})
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
    // return Meteor.subscribe('userList');
  },
  onBeforeAction: function() {
    return this.next();
  }
});