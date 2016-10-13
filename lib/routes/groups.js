Router.route('/groups/:_id', function(){
  this.render('singleGroup'),
  this.subscribe('singleGroup', this.params._id)
}, {
  name: 'group.show',
  template: 'singleGroup',
  fastRender: true,
  subscriptions: function(){
    return [
      Meteor.subscribe('trophy'),
      Meteor.subscribe('groupUsers', this.params._id)
    ]
  }
});

Router.route('/groups', {
  template: 'groups',
  fastRender: true,
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
  fastRender: true,
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

Router.route('/inviteToGroup/:_id', {
  template: 'inviteToGroup',
  fastRender: true,
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