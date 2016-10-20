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
            Router.go('/');
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
  "click #new-icon": function(event, template) {
    var files = event.currentTarget.files;
    template.$(".loading").show();
    template.$(".avatar").hide();
    console.log(files)
    Cloudinary.upload(files, {
      folder: "avatars",
      transformation: [
        {width: 200, height: 200, gravity: "face", crop: "lfill"},
      ],
      fields: {}
    }, function(error, result) {
      console.log("Did something")
      template.$(".loading").hide();
      template.$(".avatar").show();
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
