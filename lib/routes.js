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

Router.route('/settings', function () {
  this.render('settings');
});

Router.route('/notifications', function () {
  this.render('notifications');
});

Router.route('/leaderboard', function () {
  this.render('leaderboard');
  this.layout('mainView');
});

Router.route('/admin', function(){
  this.render('admin');
});  

Router.route('/groups', function(){
  this.render('groups');
});  

Router.map(function () {
  this.route('user.show',{
    path: '/user-profile/:_id',
    template: 'userProfile'
  });
  this.route('group.show',{
    path: '/groups/:_id',
    template: 'singleGroup'
  });
});