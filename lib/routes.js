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

Router.configure({
  layoutTemplate: 'mainView'
});

Router.onBeforeAction(function () {
  if (
    (this.url != '/login' && this.url != '/register' && this.url != '/recover-password')
    && (! Meteor.userId())
    && (! Meteor.loggingIn())
  ) {
      this.redirect("landing");
  } else {
    this.next();
  }
}, {except: ["landing"]});

Router.onBeforeAction(function() {
  var user = Meteor.user();

  if (user && ! user.profile.birthday) {
    Router.go("/newUserSettings");
  } else {
    this.next()
  }
}, {except: ["newUserSettings"]});

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

Router.route('/landing', {
  name: 'landing',
  template: 'landing',
  layoutTemplate: 'landingLayout'
}); 

Router.route('/', {
  template: 'activeGames',
  layoutTemplate: 'homeLayout',
  waitOn: function() {
    return [
    Meteor.subscribe('activeGames'),
    Meteor.subscribe('userData')
    ]
  },
  data: function () {
    return {
      games: Games.find().fetch()
    }
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/beta', {
  template: 'beta-invite',
  fastRender: true,
});

Router.route('/admin/betaList', {
  template: 'betaList',
  fastRender: true,
  controller: 'AdminController',
  subscriptions: function(){
    return [
      Meteor.subscribe('betaList')
    ]
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

Router.route('/newUserFavoriteTeams', function(){
  this.render('favoriteTeams');
  this.layout('loginLayout');
  this.render('favoriteTeamsHeader', {to: 'header'});
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
});

Router.route('/beta-week-leaderboard', {
  template: 'betaWeekLeaderboard',
  fastRender: true,
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
  name: 'games',
  template: 'games',
  fastRender: true,
  waitOn: function() {
    return Meteor.subscribe('games');
  },
  data: function () {
    return {
      games: Games.find().fetch()
    }
  }
});

Router.route('/game/:id', {
  name: 'game',
  template: 'home',
  fastRender: true,
  layoutTemplate: 'homeLayout',
  subscriptions: function(){
    var user = Meteor.userId();
    return [
      Meteor.subscribe('gamePlayed', user, this.params.id),
      Meteor.subscribe('game', this.params.id),
      Meteor.subscribe('activeQuestions', this.params.id),
      Meteor.subscribe('activeAtBat', this.params.id),
      Meteor.subscribe('atBatPlayer', this.params.id),
      Meteor.subscribe('activePlayers', this.params.id),
      Meteor.subscribe('userData')
    ]
  }, onBeforeAction: function(){

    Session.set('GamePlayed', this.params.id);
    return this.next();
  }
});

Router.route('/leaderboard/:id', {
  name: 'gameLeaderboard',
  template: 'gameLeaderboard',
  fastRender: true,
  subscriptions: function(){
    return [
      Meteor.subscribe('leaderboardGamePlayed', this.params.id)
    ]
  }
})

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
  template: 'history'
});

Router.route('/history/:_id', {
  name: 'gameHistory.show',
  template: 'singleGameHistory',
  data: function() {
    return this.params;
  }
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
