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

Router.onBeforeAction(function() {
  var currentUser = Meteor.user();
  if (currentUser && !currentUser.profile.birthday) {
    Router.go("/settings");
  } else {
    this.next()
  }
}, {except: ["settings"]});

// Admin controller stops anyone without the role "admin" to reach pages that are admin.
AdminController = RouteController.extend({
  onBeforeAction: function() {
    var user = Meteor.user()
    var admin = user.profile.role
    if(admin !== "admin" || admin === null){
      Router.go('/')
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
  layoutTemplate: 'homeLayout',
  subscriptions: function(){
    var currentUser = Meteor.userId()
    return [
    Meteor.subscribe('activeQuestions'),
    Meteor.subscribe('userData'),
    Meteor.subscribe('games'),   
    Meteor.subscribe('activeAtBat'),
    Meteor.subscribe('atBatPlayer'),
    Meteor.subscribe('activePlayers')
    ]
  },
  onBeforeAction: function() {
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
  Meteor.users.update(Meteor.userId(), {$set: {"profile.isOnboarded": true}});
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
  subscriptions: function() {
    return Meteor.subscribe('games');
  },
});  

Router.route('/sportRadarGames', {
  template: 'sportRadarGames',
  fastRender: true,
  subscriptions: function() {
    return Meteor.subscribe('SportRadarGames');
  }
});  

Router.route('/rules', function(){
  this.render('rules');
});  

Router.route('/history', {
  template: 'history',
  fastRender: true,
  subscriptions: function() {
    var currentUser = Meteor.userId();
    return [
    Meteor.subscribe('gamesUserPlayedIn', currentUser)
    ]
  }, 
});  

Router.route('/history/:_id', function(){
  this.render('singleGameHistory')
}, {
  name: 'gameHistory.show',
  template: 'singleGameHistory',
  fastRender: true,
  subscriptions: function(){
    return Meteor.subscribe('userData')
  }
}) 

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

Router.route('/inviteToGroup/:_id', {
  template: 'inviteToGroup',
  fastRender: true,
  subscriptions: function() {
    // return Meteor.subscribe('userList');
  },
  data: function() {
    return this.params;
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

Router.route('/chatOverview',{
  template: 'chatOverview',
  layoutTemplate: 'chatLayout'
});

Router.route('/chatRoom',{
  template: 'chatRoom',
  layoutTemplate: 'chatLayout'
});

Router.route('/searchUsers', {
  template: 'searchUsers',
  fastRender: true,
  subscriptions: function() {
    // return Meteor.subscribe('userList');
  },
  onBeforeAction: function() {
    Session.set('ionTab.current', '');
    return this.next();
  }
});

Router.route('/profile', {
  template: 'myProfile',
  subscriptions: function() {
    return Meteor.subscribe('trophy');
  },
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
    return Meteor.subscribe('trophy')
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
      Meteor.subscribe('activeGames'),
      Meteor.subscribe('pendingQuestions')
    ]
  }
}); 

Router.route('/admin/baseball', {
  template: 'adminBaseball',
  controller: 'AdminController',
  subscriptions: function(){
    return [
      Meteor.subscribe('questions'),
      Meteor.subscribe('activeQuestions'),
      Meteor.subscribe('pendingQuestions'),
      Meteor.subscribe('activeAtBat'),
      Meteor.subscribe('atBatForThisGame'),
      Meteor.subscribe('games'), 
      Meteor.subscribe('oneGamePlayers'),
      Meteor.subscribe('teams')
    ]
  }
})

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
  subscriptions: function() {
    return [
      Meteor.subscribe('trophy')
    ]
  }  
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
      Meteor.subscribe('pendingGameQuestions'),
      Meteor.subscribe('futureTasks')
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
    // return Meteor.subscribe('adminUserList');
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
  this.route('chat.show',{
    path: '/chat/:_id',
    layoutTemplate: 'chatLayout',
    template: 'chatRoom',
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

Router.route('/autologin/:token', function () {
  Meteor.loginWithToken(this.params.token);
  Router.go("/");
});
