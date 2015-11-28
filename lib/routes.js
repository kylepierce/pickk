// var checkUserLoggedIn, userAuthenticatedAdmin, userAuthenticatedBetaTester;

// checkUserLoggedIn = function() {
//   if (!Meteor.loggingIn() && !Meteor.user()) {
//     return Router.go('/landing');
//   } else {
//     return this.next();
//   }
// };

// Router.onBeforeAction(checkUserLoggedIn, {
//   except: ['/', 'landing', 'signUp', 'signIn', 'recover-password', 'reset-password', 'reset-password/:token', "verifyEmail", 'privacy', 'terms-of-use']
// });


// Router.onBeforeAction(userAuthenticatedAdmin, {
//   only: ['admin', 'adminUsers', '/admin/push', 'adminSettings', 'gameInfo']
// });


Router.configure({
  layoutTemplate: 'mainView'
});

// Admin controller stops anyone without the role "admin" to reach pages that are admin.

AdminController = RouteController.extend({
  onBeforeAction: function() {
    var user = Meteor.user()
    var admin = user.profile.role
    if(admin !== "admin" || admin === null){
      Router.go('/dashboard')
    } else {
      this.next();
    }
  }
})

//Route to the pages

Router.route('/landing', function(){
  this.render('landing');
  this.layout('landingLayout');
});

Router.route('/', {
  template: 'home',
  subscriptions: function(){
    var currentUser = Meteor.userId()
    return [
    Meteor.subscribe('activeQuestions'),
    Meteor.subscribe('userData'),
    ]
  },
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
  subscriptions: function() {
    var currentUser = Meteor.userId();
    return Meteor.subscribe('findSingle', currentUser);
  },
  onBeforeAction: function() {
    Session.set('ionTab.current', 'notifications');
    return this.next();
  }
});

Router.route('/leaderboard', {
  fastRender: true,
  subscriptions: function() {
    return [
      Meteor.subscribe('worldLeaderboard'),
      Meteor.subscribe('games')
    ];
  },
  onBeforeAction: function() {
    Session.set('ionTab.current', 'leaderboard');
    return this.next();
  }
});

Router.route('/week-leaderboard', {
  template: 'week-leaderboard',
  fastRender: true,
  subscriptions: function() {
    return [
      Meteor.subscribe('worldLeaderboard'),
      Meteor.subscribe('games')
    ];
  }
});

Router.route('/feedback', function(){
  this.render('feedback');
});  

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

Router.route('/games', {
  template: 'games',
  fastRender: true,
  waitOn: function() {
    return Meteor.subscribe('games');
  },
});  

Router.route('/rules', function(){
  this.render('rules');
});  

Router.route('/groups', {
  template: 'groups',
  fastRender: true,
  subscriptions: function() {
    return Meteor.subscribe('groups');
  },
  onBeforeAction: function() {
    Session.set('ionTab.current', 'groups');
    return this.next();
  }
});

Router.route('/allGroups', {
  template: 'allGroups',
  fastRender: true,
  subscriptions: function() {
    return Meteor.subscribe('groups');
  },
  onBeforeAction: function() {
    Session.set('ionTab.current', 'groups');
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
  template: 'inviteToGroup',
  fastRender: true,
  subscriptions: function() {
    return Meteor.subscribe('userList');
  },
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
  template: 'searchUsers',
  fastRender: true,
  subscriptions: function() {
    return Meteor.subscribe('userList');
  },
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

Router.route('/user-profile/:_id', function(){
  this.render('userProfile'),
  this.subscribe('findSingle', this.params._id)
  this.subscribe('findUserGroups', this.params._id)
}, {
  name: 'user.show',
  template: 'userProfile',
  fastRender: true,
  subscriptions: function(){
    return Meteor.subscribe('trophies')
  }
}) 


// All the admin pages require the user to have an admin role.

Router.route('admin', {
  path: '/admin',
  template: 'admin',
  controller: 'AdminController',
  subscriptions: function(){
    return [
      Meteor.subscribe('questions'),
      Meteor.subscribe('activeQuestions'),
      Meteor.subscribe('pendingQuestions')
    ]
  }
}); 

Router.route('/admin/push', {
  template: 'push',
  controller: 'AdminController',
}); 

Router.route('/admin/settings', {
  template: 'adminSettings',
  controller: 'AdminController',
}); 

Router.route('/admin/trophies',{
  template: 'trophies',
  controller: 'AdminController',
}); 

Router.route('/admin/game', {
  template: 'gameInfo',
  controller: 'AdminController',
}); 

Router.route('/admin/game-prediction', {
  template: 'gamePrediction',
  controller: 'AdminController',
  subscriptions: function() {
    return [
      Meteor.subscribe('gameQuestions'),
      Meteor.subscribe('pendingGameQuestions')
    ]
  },
}); 

Router.route('/admin/gameCharts', {
  template: 'gameCharts',
  controller: 'AdminController',
  fastRender: true,
  subscriptions: function() {
    return Meteor.subscribe('singleGame', "J6DAePumAo46FR8eL");
  },
}); 

Router.route('/admin/users', {
  path: '/admin/users',
  template: 'adminUsers',
  controller: 'AdminController',
  subscriptions: function() {
    return Meteor.subscribe('adminUserList');
  },
});




Router.map(function () {
  // this.route('user.show',{
  //   path: '/user-profile/:_id',
  //   template: 'userProfile'
  // });
  this.route('group.show',{
    path: '/groups/:_id',
    template: 'singleGroup'
  });
  this.route('editUser.show',{
    path: '/admin/users/:_id',
    template: 'editUser',
  });
  this.route('game.show',{
    path: '/admin/game/:_id',
    template: 'singleGame'
  });
  this.route('resetPwd', {
    path: '/reset-password/:token',
    layout: 'loginLayout',
  });
  this.route('verified', {
    path: '/verified',
    template: 'verified'
  });
});

Router.route('verifyEmail/:token', function(){
  this.render('verifyEmail');
  }, {
    controller: 'AccountController',
    path: '/verify-email/:token',
    action: 'verifyEmail',
    name: "verifyEmail"
  });

Router.route('/privacy', function () {
  this.render('privacy');
  this.layout('loginLayout');
});

Router.route('/terms-of-use', function () {
  this.render('terms-of-use');
  this.layout('loginLayout');
});

