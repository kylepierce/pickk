//Route to the pages

Router.route('/landing', function(){
  this.render('landing');
  this.layout('landingLayout')
});

Router.route('/', function () {
  this.render('home');
  this.layout('appLayout');
});

Router.route('/dashboard', function () {
  this.render('home');
  this.layout('appLayout');
});

Router.route('/leaderboard', function () {
  this.render('leaderboard');
  this.layout('appLayout');
});

Router.route('/profile', function () {
  this.render('profile');
  this.layout('appLayout');
});

Router.route('/admin', function(){
  this.render('admin');
  this.layout('appLayout');
}); 