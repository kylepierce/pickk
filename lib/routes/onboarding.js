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

Router.route('/onboarding', {
  template: 'newUser',
  layoutTemplate: 'loginLayout',
  waitOn: function() {
    return [
      Meteor.subscribe('newUserQuestion'),
    ]
  },
  data: function () {
    return {
      question: Questions.find().fetch()
    }
  },
  onBeforeAction: function() {
    return this.next();
  }
});