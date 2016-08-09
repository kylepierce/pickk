Router.configure({
  layoutTemplate: 'mainLayout',
  loadingTemplate: 'loader',
  notFoundTemplate: 'activeGames',
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
      Meteor.subscribe('unreadNotifications'),
      Meteor.subscribe('findThisUsersGroups', currentUser)
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
  waitOn: function() {
    // var currentUser = Meteor.userId();
    return [
      Meteor.subscribe('unreadNotifications'),
      Meteor.subscribe('trophy')
    ]
  }, 
  data: function () {
    var currentUser = Meteor.userId();
    return {
      notifications: Notifications.find({userId: currentUser}).fetch()
    }
  },
  onBeforeAction: function () {
    return this.next()
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

// Other

Router.route('/rules', function(){
  this.render('rules');
});  

Router.route('/autologin/:token', function () {
  Meteor.loginWithToken(this.params.token);
  Router.go("/home");
});

Router.route('/beta', {
  template: 'beta-invite',
  fastRender: true,
});

Router.map(function () {
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