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

Router.route('/editProfile', {
  name: 'editProfile',
  template: 'editProfile',
  yieldRegions: {
    'oldUserHeader': {to: 'header'},
    'submitOld': {to: 'submitButton'}
  },
  onBeforeAction: function () {
    return this.next()
  }
});

Router.route('/userPhoto', {
  name: "userPhoto",
  template: 'userPhoto',
  yieldRegions: {
    'oldUserHeader': {to: 'header'},
    'submitOld': {to: 'submitButton'}
  },
  data: function () {
    return {
      user: Meteor.user() 
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});

Router.route('/push-active', {
  template: 'pushPrompt',
  onBeforeAction:  function(){
    return this.next();
  }
});

Router.route('/rules', {
  template: 'rules',
  waitOn: function() {
    return [
      Meteor.subscribe('rules'),
    ]
  },
  onBeforeAction: function() {
    return this.next();
  }
});
