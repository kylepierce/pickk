Router.route('/autologin/:token', function () {
  Meteor.loginWithToken(this.params.token);
  Router.go("/home");
});

Router.route('/beta', {
  template: 'beta-invite',
  
});