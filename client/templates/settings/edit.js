AutoForm.hooks({
  settings: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();
      var done = this.done;
      var timezone = jstz.determine();
      // var email = insertDoc.emails
      // if(email){
      //   var address = email[0].address
      // } else {
      //   done("No Email");
      //   UsersProfileSchema.namedContext("settings").addInvalidKeys([{name: "emails.$.address", type: "required"}]);
      // }

      Meteor.call('updateProfile', insertDoc.profile.username, insertDoc.profile.firstName, insertDoc.profile.lastName, insertDoc.profile.birthday, timezone.name(), function(error) {
        if (error) {
          done(error);
        } else {
          done();
          if (Meteor.user().profile.isOnboarded) {
            Router.go('/push-active');
          } else {
            Router.go('/userPhoto');
          }
        }
      });
      return false;
    }
  }
});

Template.editProfile.helpers({
  UsersProfileSchema: function() {
    return UsersProfileSchema;
  }
});

Template.editProfile.events({
  'click #username': function () {
    analytics.track('Click "Username" Field', {});
  },
  'click #firstName': function () {
    analytics.track('Click "First Name"', {});
  },
  'click #lastName': function () {
    analytics.track('Click "Last Name"', {});
  },
  'click #birthday': function () {
    analytics.track('Click "Birthday"', {});
  }
});

Template.submitNew.events({
  'click #submitEditProfile': function () {
    analytics.track('Click "Finish Profile"', {
      type: "New"
    });
  }
});
Template.submitOld.events({
  'click #submitEditProfile': function () {
    analytics.track('Click "Finish Profile"', {
      type: "Old"
    });
  }
});