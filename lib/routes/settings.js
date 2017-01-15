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
