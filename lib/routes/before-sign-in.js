Router.route('/landing', {
  name: 'landing',
  template: 'landing',
  layoutTemplate: 'landingLayout',
  subscriptions: function (){
    this.subscribe('liveGamesCount');
  }
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

Router.map(function () {
  // this.route('reset-password/:token', {
    // layout: 'loginLayout',
  // });
  this.route('verified', {
    path: '/verified',
    template: 'verified'
  });
});
