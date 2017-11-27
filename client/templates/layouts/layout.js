var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

Template.mainLayout.rendered = function() {
  // IonSideMenu.snapper.settings({disable: 'right'});
  IonSideMenu.snapper.settings({touchToDrag: false});
};

Template.mainLayout.events({
  'click [data-action="gameEdit"]': function (e, t) {
    IonPopover.show('_editGame', this, e.currentTarget);
  },
  'click [data-action=skip]': function(e, t){
    var leagueId = Router.current().params._id
    Router.go('/league/'+ leagueId);
  },
  'click [data-action=filterGames]': function() {
    IonModal.open('gamesFilter');
  },
  'click [data-action=filterMatchups]': function () {
    IonModal.open('filterMatchups');
  },
  'click [data-action=filterLeaderboard]': function () {
    IonModal.open('weekFilter');
  },
  'click [data-action=filterGameLeaderboard]': function () {
    IonModal.open('singleGameFilter');
  },
  'click [data-action=filterNotifications]': function () {
    IonModal.open('notificationFilter');
  },


  // 'click [data-action=editMatchup]': function(){
  //   IonActionSheet.show({
  //     titleText: 'Are You Sure You Want To Leave?',
  //     buttons: [
  //       { text: 'Leave Matchup' },
  //     ],
  //     destructiveText: '',
  //     cancelText: 'Cancel',
  //     cancel: function() {},
  //     buttonClicked: function(index) {
  //       if (index === 0) {
  //         var currentUserId = Meteor.userId();
  //         var matchupId = Router.current().params._id
  //         Meteor.call('leaveMatchup', matchupId, currentUserId);
  //         Router.go('/matchup');
          
  //       }
  //     }
  //   });
  // },
});

Template.sideMenuContent.onCreated( function() {
  this.diamonds = new ReactiveVar( "0" )
});

Template.sideMenuContent.helpers({
  diamonds: function () {
    var thisWeek = moment().week()
    var day = moment().day()
    if (day < 2){
      var thisWeek = thisWeek - 1
    }
    var userId = Meteor.userId();
    var template = Template.instance()

    Meteor.call("thisWeeksDiamonds", userId, thisWeek, function (error, result) {
      if ( error ){
        console.log(error)
      } else {
        // If there isnt any data set to zero
        if (result[0] === undefined){
          template.diamonds.set(0)
        } else {
          var diamondCount = result[0].result
          template.diamonds.set(diamondCount)
        }
      }
    })

    return Template.instance().diamonds.get();
  },
  pendingNotifications: function(){
    Meteor.subscribe('unreadNotificationsCount');
    var count = Counts.get('unreadNotificationsCount');
    if(count === 0){
      return false
    } else if (count > 0){
      return true
    }
  },
  notificationNumber: function() {
    var count = Counts.get('unreadNotificationsCount');
    return count
  },
  userId: function () {
    return Meteor.userId();
  },
  connected: function() {
    if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
      return Meteor.status().connected;
    } else {
      return true;
    }
  },
  admin: function() {
    var currentUser = Meteor.user();
    return currentUser && currentUser.profile.role === "admin";
  },
  beta: function() {
    var currentUser = Meteor.user();
    return currentUser && currentUser.profile.role === "beta";
  }
});

Template.loader.rendered = function() {
  var start = parseInt(new Date().getTime() / 1000);
  Session.set('timeRendered', start);
};

Template.loader.helpers({
  takingAwhile: function () {
    var rendered = parseInt(new Date().getTime() / 1000);
    var created = Session.get('timeRendered');
    var start = parseInt(created);
    var rightNow = parseInt(Chronos.now() / 1000)
    var timeSpent = rightNow - start

    if(start > rendered){
      console.log("Wait a second ")
    } else if(timeSpent > 14){
      return true
    }
  }
});

Template.pageNotFound.events({
  'click [data-action="back"]': function () {
    var previous = window.history.go(-2);
    Router.go(previous);
  },
  'click [data-action="reload"]': function () {
    Router.go("/");
    location.reload();
  },
});

Template.loader.events({
  'click [data-action="back"]': function () {
    var previous = window.history.go(-2);
    Router.go(previous);
  },
  'click [data-action="reload"]': function () {
    Router.go("/");
    location.reload();
  },
});

Template.deepBackButton.helpers({
  'classes': function () {
    var classes = ['buttons button button-clear back-button pull-left'];
    return classes
  },
  'text': function () {
    return ""
  },
  'icon': function () {
    if (Platform.isAndroid()) {
      return 'android-arrow-back';
    }

    return 'ios-arrow-back';
  }
});

Template.deepBackButton.events({
  'click [data-action=deepBack]': function (e, t) {
    Session.set('ionNavDirection', 'forward')
    var newlyCreated = Router.current().params.query.new
    if (newlyCreated) {
      $('[data-nav-container]').addClass('nav-view-direction-back');
      $('[data-navbar-container]').addClass('nav-bar-direction-back');
      Router.go('/' + t.data.where)
    } else {
      $('[data-nav-container]').addClass('nav-view-direction-back');
      $('[data-navbar-container]').addClass('nav-bar-direction-back');
      window.history.back();
    }
  },
});