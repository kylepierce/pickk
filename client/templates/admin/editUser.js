Meteor.subscribe('groups')
Meteor.subscribe('trophies')

Template.editUser.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('profile', Router.current().params._id);
  }.bind(this));
};


Template.editUser.helpers({
  profile: function () {
    var id = Router.current().params._id
    Meteor.subscribe('findSingle', id)
    return UserList.findOne({_id: id});
  },
  group: function() {
    return this.profile.groups
  },
  trophies: function() {
    return Trophies.find({}).fetch()
  },
  trophy: function() {
    return this.profile.trophies
  },
  trophyData: function(id){
    return Trophies.findOne({_id: id})
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
  'submit form': function(event, template){
    event.preventDefault();
    var user = Router.current().params._id
    var trophyId = template.find('#trophy :selected').value
    Meteor.call('awardTrophy', trophyId, user);
    Meteor.call('notifyTrophyAwarded', trophyId, user);
  }
})