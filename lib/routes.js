Router.configure({
  layoutTemplate: 'mainLayout',
  loadingTemplate: 'loader',
  notFoundTemplate: 'notFound',
});

BaseController = RouteController.extend({

});

// Stops users who are not signed in
anonymousController = BaseController.extend({
  layoutTemplate: 'landingLayout',
  onBeforeAction: function(){
    if (
      (this.url != '/login' && this.url != '/register' && this.url != '/recover-password')
      && (! Meteor.userId())
      && (! Meteor.loggingIn())
    ) {
        this.redirect("landing");
    } else {
      this.next();
    }
  }
  // Fix Next
  // , {except: ["landing"]};
});

// Double check they are signed in
authenticatedController = anonymousController.extend({
  layoutTemplate: 'mainLayout',
  waitOn: function(){ 
    var currentUser = Meteor.userId()
    return [
      Meteor.subscribe('userData'),
      Meteor.subscribe('unreadNotifications', currentUser),
    ];
  },

  onBeforeAction: function(){
    if (!Meteor.loggingIn() && !Meteor.user()) {
       Router.go('/landing');
    }

    if (Meteor.user()) {
      var username = Meteor.user().profile.username;
      var favoriteTeam = Meteor.user().profile.favoriteTeams;
      if (username === "" || username === null || username === "undefined") {
        Router.go('/newUserSettings')
      } else if (!favoriteTeam){
        Router.go('/newUserFavoriteTeams')
      }
    }
    this.next();
  },

  action: function () {
    this.render();
  }
  // Router.onBeforeAction(function() {
  // var user = Meteor.user();

  // if (user && ! user.profile.birthday) {
  //   Router.go("/newUserSettings");
  // } else {
  //   this.next()
  // }
  // }, {except: ["newUserSettings"]});

  // wait for the several subscriptions which a logged-in user needs
  // the 'loading' template will be displayed until all subscriptions are ready
});

// Admin controller stops anyone without the role "admin" to reach pages that are admin.
adminController = authenticatedController.extend({
  onBeforeAction: function() {
    var user = Meteor.user()
    var admin = user.profile.role
    if(admin !== "admin" || admin === null){
      Router.go('/')
    } else {
      this.next();
    }
  }
});


// Before Sign In

Router.route('/landing', {
  name: 'landing',
  template: 'landing',
  layoutTemplate: 'landingLayout'
}); 

Router.route('/privacy', function () {
  this.render('privacy');
  this.layout('loginLayout');
});

Router.route('/terms-of-use', function () {
  this.render('terms-of-use');
  this.layout('loginLayout');
});

Router.route('verifyEmail/:token', function(){
  this.render('verifyEmail');
  }, {
    controller: 'AccountController',
    path: '/verify-email/:token',
    action: 'verifyEmail',
    name: "verifyEmail"
  });

// Onboarding

Router.route('/settings', {
  template: 'settings',
  yieldRegions: {
    'oldUserHeader': {to: 'header'},
    'submitOld': {to: 'submitButton'}
  },
  onBeforeAction:  function(){
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



// *** Home Route ***
Router.route('/', {
  template: 'activeGames',
  layoutTemplate: 'homeLayout',
  controller: 'authenticatedController',
  waitOn: function() {
    return [
      Meteor.subscribe('activeGames'),
      Meteor.subscribe('teams')
    ]
  },
  data: function () {
    return {
      game: Games.find().fetch()
    }
  },
  onBeforeAction: function() {
    return this.next();
  }
});


Router.route('/notifications', {
  controller: 'authenticatedController',
  subscriptions: function() {
    var currentUser = Meteor.userId();
    return [
      // Meteor.subscribe('findSingle', currentUser),
      Meteor.subscribe('trophy')
    ]
  }
});

// Leaderboards

Router.route('/leaderboard', {
  fastRender: true,
  subscriptions: function() {
    return [
      Meteor.subscribe('worldLeaderboard'),
      Meteor.subscribe('games')
    ];
  },
  onBeforeAction: function() {
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

Router.route('/week-leaderboard', {
  template: 'week-leaderboard',
  fastRender: true,
});

Router.route('/beta-week-leaderboard', {
  template: 'betaWeekLeaderboard',
  fastRender: true,
});
 

// Games

Router.route('/games', {
  name: 'games',
  template: 'games',
  fastRender: true,
  controller: 'authenticatedController',
  waitOn: function() {
    return [
      Meteor.subscribe('games'),
      Meteor.subscribe('activeGames')
    ]
  },
  data: function () {
    return {
      games: Games.find().fetch()
    }
  }
});

Router.route('/game/:id', {
  name: 'game.show',
  template: 'home',
  fastRender: true,
  layoutTemplate: 'homeLayout',
  controller: 'authenticatedController',
  waitOn: function () {
    var user = Meteor.userId();
    return [
      Meteor.subscribe('gamePlayed', user, this.params.id),
      Meteor.subscribe('game', this.params.id),
      Meteor.subscribe('activeQuestions', this.params.id),
      Meteor.subscribe('activeAtBat', this.params.id),
      Meteor.subscribe('atBatPlayer', this.params.id),
      Meteor.subscribe('activePlayers', this.params.id),
      Meteor.subscribe('teams'),
    ]
  },
  data: function () {
    return {
      game: Games.find({}).fetch()
    }   
  },
  onBeforeAction: function(){
    Session.set('GamePlayed', this.params.id);
    return this.next();
  }
});

// History

Router.route('/history', {
  template: 'history',
  fastRender: true,
  controller: 'authenticatedController',
  waitOn: function() {
    return [
      Meteor.subscribe('gamesPlayed')
    ]
  },
  data: function () {
    return {
      games: Games.find().fetch()
    }
  },
  onBeforeAction: function ( ) {
    return this.next();
  }
});

Router.route('/history/:_id', {
  name: 'gameHistory.show',
  template: 'singleGameHistory',
  data: function() {
    return this.params;
  }
});


// Groups
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
    // return Meteor.subscribe('userList');
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

// Chat

Router.route('/chatOverview',{
  template: 'chatOverview',
  layoutTemplate: 'chatLayout'
});

Router.route('/chatRoom',{
  template: 'chatRoom',
  layoutTemplate: 'chatLayout'
});

// Users

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
}) 

// Other

Router.route('/rules', function(){
  this.render('rules');
});  

Router.route('/autologin/:token', function () {
  Meteor.loginWithToken(this.params.token);
  Router.go("/");
});

Router.route('/beta', {
  template: 'beta-invite',
  fastRender: true,
});

Router.route('/admin/betaList', {
  template: 'betaList',
  fastRender: true,
  controller: 'adminController',
  subscriptions: function(){
    return [
      Meteor.subscribe('betaList')
    ]
  }
});


// All the admin pages require the user to have an admin role.
Router.route('admin', {
  path: '/admin',
  template: 'admin',
  controller: 'adminController',
  subscriptions: function(){
    return [
      Meteor.subscribe('questions'), // Remove soon
      Meteor.subscribe('activeQuestions'),
      Meteor.subscribe('activeGames'),
      Meteor.subscribe('pendingQuestions')
    ]
  }
}); 

Router.route('/admin/baseball', {
  template: 'adminBaseball',
  controller: 'adminController',
  subscriptions: function(){
    return [
      Meteor.subscribe('questions'), // Remove soon
      Meteor.subscribe('activeQuestions'),
      Meteor.subscribe('pendingQuestions'),
      Meteor.subscribe('activeAtBat'),
      // Meteor.subscribe('atBatForThisGame'),
      Meteor.subscribe('games'), 
      // Meteor.subscribe('oneGamePlayers'),
      Meteor.subscribe('teams')
    ]
  }
})

Router.route('/admin/push', {
  template: 'push',
  controller: 'adminController',
}); 

Router.route('/admin/settings', {
  template: 'adminSettings',
  controller: 'adminController',
}); 

Router.route('/admin/trophies',{
  template: 'trophies',
  controller: 'adminController',
  subscriptions: function() {
    return [
      Meteor.subscribe('trophy')
    ]
  }  
}); 

Router.route('/admin/game', {
  template: 'gameInfo',
  controller: 'adminController',
}); 

Router.route('/admin/game-prediction', {
  template: 'gamePrediction',
  controller: 'adminController',
  subscriptions: function() {
    return [
      Meteor.subscribe('gameQuestions'),
      Meteor.subscribe('pendingGameQuestions'),
    ]
  },
}); 




Router.map(function () {
  // this.route('user.show',{
  //   path: '/user-profile/:_id',
  //   template: 'userProfile'
  // });
  this.route('editUser.show',{
    path: '/admin/users/:_id',
    template: 'editUser',
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


// Router.route('/sportRadarGames', {
//   template: 'sportRadarGames',
//   fastRender: true,
//   subscriptions: function() {
//     return Meteor.subscribe('SportRadarGames');
//   }
// });  

// Router.route('/feedback', function(){
//   this.render('feedback');
// }); 