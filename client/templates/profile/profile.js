Meteor.subscribe('groups')

Template.userProfile.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('profile', Router.current().params._id);
  }.bind(this));
};

// Template.userProfile.rendered = function () {
//   this.autorun(function () {
//     if (!this.subscription.ready()) {
//       IonLoading.show();
//     } else {
//       IonLoading.hide();
//     }
//   }.bind(this));
// };

Template.userProfile.helpers({
  profile: function () {
    return UserList.findOne({_id: Router.current().params._id});
  },
  group: function() {
    var user = UserList.findOne({_id: Router.current().params._id});
    return user.profile.groups
    console.log(this.user.profile.groups)
  }
});
