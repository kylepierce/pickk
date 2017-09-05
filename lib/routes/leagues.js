Router.route('/leagues', {
  name: 'leagues',
  template: 'leagues',
  waitOn: function () {
    var userId = Meteor.userId();
    var groupId = this.params._id
    return [
      Meteor.subscribe("findThisUsersGroups", userId),
      Meteor.subscribe('sectionHeros', ['league'])
    ]
  },
  data: function () {
    return {
      hero: Hero.find().fetch(),
      leagues: Groups.find().fetch()
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});

Router.route('/league/create', {
  template: 'newLeague',
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/league/:_id/', {
  name: 'league.show',
  template: 'singleLeague',
  layoutTemplate: 'homeLayout',
  waitOn: function () {
    var userId = Meteor.userId();
    var leagueId = this.params._id
    return [
      Meteor.subscribe('singleGroup', leagueId),
      Meteor.subscribe('trophy'),
      Meteor.subscribe('groupUsers', leagueId),
      Meteor.subscribe("singleLeagueMatchups", leagueId)
    ]
  },
  data: function () {
    return {
      league: Groups.findOne({_id: this.params._id })
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});

Router.route('/league/settings/:_id/', {
  template: 'leagueSettings',
  waitOn: function () {
    var userId = Meteor.userId();
    var groupId = this.params._id
    return [
      Meteor.subscribe('singleGroup', groupId),
    ]
  },
  data: function () {
    return {
      league: Groups.findOne({_id: this.params._id })
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});

Router.route('/league/settings/photo/:_id/', {
  template: 'leaguePhoto',
  waitOn: function () {
    var userId = Meteor.userId();
    var leagueId = this.params._id
    return [
      Meteor.subscribe('singleGroup', leagueId),
    ]
  },
  data: function () {
    return {
      league: Groups.findOne({_id: this.params._id })
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});

Router.route('/league/week-leaderboard/:leagueId', {
  template: 'week-leaderboard',
  layoutTemplate: "notificationLayout",
  yieldRegions: {
    'weekFilter': {to: 'filter'},
    'backButton': {to: 'header'}
  },
  waitOn: function() {
    return [
      Meteor.subscribe('userData')
    ]
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/league/association/:_id', {
  template: 'leagueAssociation',
  layoutTemplate: 'homeLayout',
  waitOn: function () {
    var userId = Meteor.userId();
    var groupId = this.params._id
    return [
      Meteor.subscribe('singleGroup', groupId),
      Meteor.subscribe('groupUsers', groupId),
    ]
  },
  data: function () {
    return {
      league: Groups.findOne({_id: this.params._id })
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});

Router.route('/league/members/:_id/', {
  template: '_leagueMembers',
  waitOn: function () {
    var userId = Meteor.userId();
    var groupId = this.params._id
    return [
      Meteor.subscribe('singleGroup', groupId),
      Meteor.subscribe('groupUsers', groupId),
    ]
  },
  data: function () {
    return {
      league: Groups.findOne({_id: this.params._id })
    }
  },
  onBeforeAction: function(){
    return this.next();
  }
});

Router.route('/league/invite/:_id', {
  template: 'inviteToLeague',
  yieldRegions: {
    'backButton': {to: 'header'}
  },
  subscriptions: function() {
    return Meteor.subscribe('singleGroup', this.params._id);
  },
  data: function() {
    return this.params;
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/league/new/invite/:_id', {
  template: 'inviteToLeague',
  yieldRegions: {
    'skip': {to: 'header'}
  },
  subscriptions: function() {
    return Meteor.subscribe('singleGroup', this.params._id);
  },
  data: function() {
    return this.params;
  },
  onBeforeAction: function() {
    return this.next();
  }
});

Router.route('/searchLeagues', {
  template: 'searchLeagues',
  onBeforeAction: function() {
    return this.next();
  }
});
