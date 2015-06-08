Router.configure({
  layoutTemplate: 'mainView'
});


//Route to the pages

Router.route('/landing', function(){
  this.render('landing');
  this.layout('landingLayout');
});

Router.route('/', function () {
  this.render('home');
});

Router.route('/dashboard', function () {
  this.render('home');
});

Router.route('/leaderboard', function () {
  this.render('leaderboard');
  this.layout('mainView');
});

Router.route('/user-profile', function () {
  this.render('user-profile');
  this.layout('mainView');
});

Router.route('/admin', function(){
  this.render('admin');
});  