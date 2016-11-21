AutoForm.hooks({
  settings: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();
      var done = this.done;
      var timezone = jstz.determine();

      Meteor.call('updateProfile', insertDoc.username, insertDoc.firstName, insertDoc.lastName, insertDoc.birthday, timezone.name(), function(error) {
        if (error) {
          done(error);
        } else {
          done();
          if (Meteor.user().profile.isOnboarded) {
            Router.go('/push-active');
          } else {
            Router.go('/newUserFavoriteTeams');
          }
        }
      });
      return false;
    }
  }
})

Template.settings.helpers({
  UsersProfileSchema: function() {
    return UsersProfileSchema;
  }
});

Template.settings.events({
  "change #new-icon": function(e, t) {
    console.log(e, t)
    var files = e.currentTarget.files;
    t.$(".loading").show();
    t.$(".avatar").hide();
    console.log(files)
    IonLoading.show({
      customTemplate: "Uploading...",
      duration: 5000,
      backdrop: true
    });
    Cloudinary.upload(files, {
      folder: "avatars",
      transformation: [
        {width: 200, height: 200, gravity: "face", crop: "lfill"},
      ],
      fields: {}
    }, function(error, result) {
      console.log("Did something")
      t.$(".loading").hide();
      t.$(".avatar").show();
      if (error) {
        throw error;
      }
      Meteor.users.update(Meteor.userId(), {$set: {"profile.avatar": result}});
      // Add a analytics code right here
      var route = Router.current().originalUrl
      if(route.includes("newUserSettings")) {
        var newOrNah = true
      } else {
        var newOrNah = false
      }
      var currentUser = Meteor.userId();
      analytics.track("userAddAvatar", {
        id: currentUser,
        newUser: newOrNah
      });
      console.log("Upload Error: ", error);
      console.log("Upload Result: ", result);
    });
  }

});
