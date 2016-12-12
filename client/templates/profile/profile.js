Template.userProfile.onCreated( function() {
  this.diamonds = new ReactiveVar( "0" );
  this.coins = new ReactiveVar( "0" );
  this.queCounter = new ReactiveVar( "0" );
});

Template.userProfile.helpers({
  totalDiamonds: function () {
    var userId = Router.current().params._id
    if (userId === undefined){
      var userId = Meteor.userId();
    }
    var template = Template.instance()

    Meteor.call("totalDiamonds", userId, function (error, result) {
      if ( error ){
        console.log(error)
      } else {
        // If there isnt any data set to zero
        if (result === "undefined"){
          template.diamonds.set(0)
        }
        template.diamonds.set(result)
      }
    });

    return Template.instance().diamonds.get();
  },
  totalCoins: function () {
    var userId = Router.current().params._id
    if (userId === undefined){
      var userId = Meteor.userId();
    }
    var template = Template.instance()

    function insertDecimal(num) {
      return (num / 10000).toFixed(3);
    }

    Meteor.call("totalCoins", userId, function (error, result) {
      if ( error ){
        console.log(error)
      } else {
        // If there isnt any data set to zero
        if (result === "undefined"){
          template.coins.set(0)
        }
        template.coins.set(result)
      }
    });

    return Template.instance().coins.get();
  },
  // totalQue: function () {
  //   var userId = Router.current().params._id
  //   if (userId === undefined){
  //     var userId = Meteor.userId();
  //   }
  //   var template = Template.instance()
  //
  //   Meteor.call("totalQue", userId, function (error, result) {
  //     if ( error ){
  //       console.log(error)
  //     } else {
  //       // If there isnt any data set to zero
  //       if (result === "undefined"){
  //         template.queCounter.set(0)
  //       }
  //       template.queCounter.set(result)
  //     }
  //   });
  //
  //   return Template.instance().queCounter.get();
  // },
  trophies: function ( ) {
    var trophies = this.user.profile.trophies
    return trophies
  },
  groups: function () {
    var groups = this.user.profile.groups
    return groups
  },
  notOwnProfile: function ( userId ) {
    if ( userId !== Meteor.userId() ){
      return true
    }
  }
});

Template.displayTrophy.helpers({
  trophy: function (t) {
    Meteor.subscribe('trophy');
    var trophy = Trophies.findOne({_id: t})
    return trophy
  },
});

Template.displayGroup.helpers({
  group: function (g) {
    var group = Groups.findOne({_id: g})
    return group
  },
});

Template.followerCheck.helpers({
  alreadyFollower: function() {
    var currentUserId = Meteor.userId();
    var followers = this.user.profile.followers
    var alreadyFollower = followers.indexOf(currentUserId)
    if(alreadyFollower !== -1 ){
      return true
    }
  }
});

Template.followerCheck.events({
  'click [data-action=followUser]': function() {
    var currentUserId = Meteor.userId();
    var accountToFollow = Router.current().params._id
    if(Meteor.isCordova){
      //Intercom needs unix time with '_at' in JSON to work.
      var intercomData = {
        "followed": true,
        "last_follow_at": parseInt(Date.now() / 1000),
        "userId": currentUserId,
      }
      updateIntercom(intercomData)
    }
    // Add this user followers
    Meteor.call('followUser', currentUserId, accountToFollow);

  },
  'click [data-action=unfollowUser]': function() {
    var currentUserId = Meteor.userId();
    var accountToFollow = Router.current().params._id

    // Remove this user from followers
    Meteor.call('unfollowUser', currentUserId, accountToFollow);
  }
});
