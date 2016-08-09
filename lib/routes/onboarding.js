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