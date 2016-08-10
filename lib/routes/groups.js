Router.route('/groups/:_id', function(){
  this.render('singleGroup'),
  this.subscribe('singleGroup', this.params._id)
}, {
  name: 'group.show',
  template: 'singleGroup',
  fastRender: true,
  controller: 'authenticatedController',
  subscriptions: function(){
    return Meteor.subscribe('trophy')
  }
});

Router.route('/groups', {
  template: 'groups',
  fastRender: true,
  controller: 'authenticatedController',
  subscriptions: function() {
    // Fix next
    // return Meteor.subscribe('groups'); 
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/allGroups', {
  template: 'allGroups',
  fastRender: true,
  controller: 'authenticatedController',
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
  controller: 'authenticatedController',
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