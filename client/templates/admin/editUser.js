Meteor.subscribe('groups')

Template.editUser.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('profile', Router.current().params._id);
  }.bind(this));
};


Template.editUser.helpers({
  profile: function () {
    return UserList.findOne({_id: Router.current().params._id});
  },
  group: function() {
    return this.profile.groups
  },
  following: function(){
    var numFollowing = this.profile.following;
    return numFollowing.length
  },
  follower: function(){
    var numFollow = this.profile.followers;
    return numFollow.length
  }
});

Template.editUser.events({
  'click [data-action=update-coins]': function(event, template){
    var user = Router.current().params._id
    var coins = template.find('input[name=coins]').value
    Meteor.call("updateCoins", user, coins)
  },
  'click [data-action=update-name]': function(event, template){
    var user = Router.current().params._id
    var name = template.find('input[name=username]').value
    Meteor.call("updateName", user, name)
  },
  'click #makeAdmin': function(){
    var user = Router.current().params._id
    Meteor.call("makeAdmin", user)
  }
})