//Route to the pages
Router.route('/landing', function(){
  this.render('landing');
});

Router.configure({
  layoutTemplate: 'appLayout'
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/dashboard', function () {
  this.render('home');
});

Router.route('/leaderboard', function () {
  this.render('leaderboard');
});

Router.route('/profile', function () {
  this.render('profile');
});

Router.route('/admin', function(){
	this.render('admin');
});