Router.configure({
  layoutTemplate: 'mainView'
});


//Route to the pages

Router.route('/landing', function(){
  this.render('landing');
  this.layout('landingLayout');
});

Router.route('/', {
  template: 'home',
  onBeforeAction: function() {
    Session.set('ionTab.current', 'dashboard');
    return this.next();
  }
});

Router.route('/dashboard', {
  path: 'dashboard',
  template: 'home',
  onBeforeAction: function() {
    Session.set('ionTab.current', 'dashboard');
    return this.next();
  }
});
Router.route('/settings', {
  template: 'settings',
  yieldRegions: {
    'oldUserHeader': {to: 'header'},
    'submitOld': {to: 'submitButton'}
  },
  onBeforeAction:  function(){
    Session.set('ionTab.current', '');
    return this.next();
  }
});

Router.route('/newUserSettings', function(){
  this.render('settings');
  this.layout('loginLayout');
  this.render('newUserHeader', {to: 'header'})
  this.render('submitNew', {to: 'submitButton'})
});

Router.route('/onboarding', function(){
  this.render('newUser');
  this.layout('loginLayout');
});

Router.route('/notifications', {
  onBeforeAction: function() {
    Session.set('ionTab.current', 'notifications');
    return this.next();
  }
});

Router.route('/leaderboard', {
    onBeforeAction: function() {
    Session.set('ionTab.current', 'leaderboard');
    return this.next();
  }
});

Router.route('admin', {
  path: '/admin',
  template: 'admin',
  subscriptions: function(){
    return [
      Meteor.subscribe('questions'),
      Meteor.subscribe('activeQuestions'),
      Meteor.subscribe('pendingQuestions')
    ]
  }
}); 

Router.route('/admin/push', function(){
  this.render('push');
}); 

Router.route('/admin/settings', function(){
  this.render('adminSettings');
}); 

Router.route('/admin/trophies', function(){
  this.render('trophies');
}); 

Router.route('/admin/game', function(){
  this.render('gameInfo');
}); 

Router.route('/feedback', function(){
  this.render('feedback');
});  

Router.route('/games', function(){
  this.render('games');
});  

Router.route('/rules', function(){
  this.render('rules');
});  

Router.route('/admin/users', {
  path: '/admin/users',
  template: 'adminUsers',
})

Router.route('invites', {
  path: '/admin/invites',
  template: 'invites',
  // waitOn: function() {
  //   return Meteor.subscribe('/invites');
  // },
  onBeforeAction: function() {
    Session.set('currentRoute', 'invites');
    return this.next();
  }
});

Router.route('/groups', {
  onBeforeAction: function() {
    Session.set('ionTab.current', '');
    return this.next();
  }
});  

Router.route('/newgroup', {
  template: 'newGroup',
  onBeforeAction: function() {
    Session.set('ionTab.current', '');
    return this.next();
  }
});

Router.route('/inviteToGroup', {
  onBeforeAction: function() {
    Session.set('ionTab.current', '');
    return this.next();
  }
});

Router.route('/searchGroups', {
  onBeforeAction: function() {
    Session.set('ionTab.current', '');
    return this.next();
  }
});

Router.route('/searchUsers', {
  onBeforeAction: function() {
    Session.set('ionTab.current', '');
    return this.next();
  }
});

Router.route('/profile', {
  template: 'myProfile',
  onBeforeAction: function() {
    Session.set('ionTab.current', 'profile');
    return this.next();
  }
});

Router.map(function () {
  this.route('user.show',{
    path: '/user-profile/:_id',
    template: 'userProfile'
  });
  this.route('group.show',{
    path: '/groups/:_id',
    template: 'singleGroup'
  });
  this.route('editUser.show',{
    path: '/admin/users/:_id',
    template: 'editUser'
  });
  this.route('game.show',{
    path: '/admin/game/:_id',
    template: 'singleGame'
  });
});

Router.route('/privacy', function () {
  this.render('privacy');
  this.layout('loginLayout');
});

Router.route('/terms-of-use', function () {
  this.render('terms-of-use');
  this.layout('loginLayout');
});

