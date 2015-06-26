Template.userProfile.created = function () {
  this.autorun(function () {
    this.subscription = Meteor.subscribe('profile', Router.current().params._id);
  }.bind(this));
};

Template.userProfile.rendered = function () {
  this.autorun(function () {
    if (!this.subscription.ready()) {
      IonLoading.show();
    } else {
      IonLoading.hide();
    }
  }.bind(this));
};

Template.userProfile.helpers({
  profile: function () {
    return UserList.findOne({_id: Router.current().params._id});
  }
});

Template.userProfile.events({
  'click [data-action=fake]': function (event, template) {
    event.preventDefault();
    alert('Gotcha!');
  }
});