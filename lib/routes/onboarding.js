Router.route('/newUserSettings', function(){
  this.render('editProfile');
  this.layout('loginLayout');
  this.render('newUserHeader', {to: 'header'})
  this.render('submitNew', {to: 'submitButton'})
});

// Router.route('/newUserFavoriteTeams:step?', function(){
//   this.render('favoriteTeams');
//   this.layout('loginLayout');
//   this.render('favoriteTeamsHeader', {to: 'header'});
// });

Router.route('/newUserFavoriteTeams/:step?', {
  name: 'favoriteTeams',
  template: 'favoriteTeams',
  layout: 'loginLayout',
  // waitOn: function () {
  //   var userId = Meteor.userId();
  //   var groupId = this.params._id
  //   return [
  //     Meteor.subscribe('userIsCommissioner', userId),
  //     Meteor.subscribe("liveGames"),
  //     Meteor.subscribe('activeGames', 'week', ["NBA", "NFL", "MLB"])
  //   ]
  // },
  // data: function () {
  //   return {
  //     games: Games.find({})
  //   }
  // },
  onBeforeAction: function() {
    if (!this.params.step) {
      this.redirect('favoriteTeams', {
        step: 'selectSports'
      });
    } else {
      this.next();
    }
  }
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
