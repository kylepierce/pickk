var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

Template.mainLayout.rendered = function() {
  // IonSideMenu.snapper.settings({disable: 'right'});
  IonSideMenu.snapper.settings({touchToDrag: false});
};

Template.sideMenuContent.events({
  'click [data-action=logout]': function () {
    AccountsTemplates.logout();
    if (Meteor.isCordova) {
      Branch.logout();
    }
    analytics.reset();
    Router.go("/landing")
	},
  'click [data-action=profile]': function () {
    var userId = Meteor.userId();
    Router.go("/user-profile/" + userId)
  },
  'click .item-icon-left': function (){
    IonSideMenu.snapper.close();
  },
  'click .js-share-link': function(event) {
    event.preventDefault();
    var branchUniversalObj = null;
    var ref = Meteor.userId()
    var username = Meteor.user().profile.username
    var message = "Play Against Me and Predict What Happens Next in Live Sports With Pickk!"
    if(Meteor.isCordova){
      Branch.createBranchUniversalObject({
        canonicalIdentifier: 'user-profile/'+ ref,
        title: 'Live Game Challenge!',
        contentDescription: message,
        contentMetadata: {
          'userId': ref,
          'userName': username
        }
      }).then(function (newBranchUniversalObj) {
        branchUniversalObj = newBranchUniversalObj;
        branchUniversalObj.showShareSheet({
          // put your link properties here
          "feature" : "share",
          "tags": ['menu']
        }, {
          // put your control parameters here
          "$deeplink_path" : "/user-profile/" + ref,
        }, message);
      });
    }

    // Analytics
    analytics.track("Invite Friend", {
      userId: ref,
      location: "Menu"
    });
  },
  'click .contact-us': function (e, t){
    e.preventDefault()
    if (Meteor.isCordova) {
      intercom.displayMessenger();
    }
  },
  'click [data-action=notifications]': function(){
    IonSideMenu.snapper.close();
    Router.go('/notifications/?read=false');
  },
  'click [data-action=allNotifications]': function(){
    IonSideMenu.snapper.close();
    Router.go('/notifications');
  }
});

Template.mainLayout.events({
  'click [data-action="gameEdit"]': function (e, t) {
    IonPopover.show('_editGame', this, e.currentTarget);
  },
  'click [data-action=skip]': function(e, t){
    var groupId = Router.current().params._id
    Router.go('/groups/'+groupId)
  },
  'click [data-action=editMatchup]': function(){
    IonActionSheet.show({
      titleText: 'Are You Sure You Want To Leave?',
      buttons: [
        { text: 'Leave Matchup <i class="icon ion-share"></i>' },
      ],
      destructiveText: '',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          var currentUserId = Meteor.userId();
          var matchup = Router.current().params._id

          // Remove this user from the group
          Meteor.call('leaveMatchup', matchup, currentUserId);
          return true
        }
      }
    });
  },
  'click [data-action=adminEditMatchup]': function(){
    IonActionSheet.show({
      titleText: '',
      buttons: [
        { text: 'Update Matchup' },
        { text: 'Delete Matchup <i class="icon ion-share"></i>' },
      ],
      destructiveText: '',
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          var currentUserId = Meteor.userId();
          var matchup = Router.current().params._id

          // Remove this user from the group
          Meteor.call('leaveMatchup', matchup, currentUserId);
          // var group = Groups.findOne({_id: groupId})
          // var groupName = group.name
          // sAlert.success("You Left " + groupName , {effect: 'slide', position: 'bottom', html: true});
          return true
        }
      }
    });
  },
});

Template.sideMenuContent.onCreated( function() {
  this.diamonds = new ReactiveVar( "0" )
});

Template.sideMenuContent.helpers({
  messageCount: function (){
    var count = intercom.unreadConversationCount();
    return count
  },
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
