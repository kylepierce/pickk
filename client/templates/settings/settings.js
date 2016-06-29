AutoForm.hooks({
  settings: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();
      var done = this.done;
      Meteor.call('updateProfile', insertDoc.username, insertDoc.firstName, insertDoc.lastName, insertDoc.birthday, function(error) {
        if (error) {
          done(error);
        } else {
          done();
          if (Meteor.user().profile.isOnboarded) {
            Router.go('/');
          } else {
            Router.go('/onboarding');
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
  "change input[name='avatar']": function(event, template) {
    var files = event.currentTarget.files;
    template.$(".loading").show();
    template.$(".avatar").hide();
    Cloudinary.upload(files, {
      folder: "avatars",
      transformation: [
        {width: 200, height: 200, gravity: "face", crop: "lfill"},
      ],
      fields: {}
    }, function(error, result) {
      template.$(".loading").hide();
      template.$(".avatar").show();
      if (error) {
        throw error;
      }
      Meteor.users.update(Meteor.userId(), {$set: {"profile.avatar": result}});
      //console.log("Upload Error: ", error);
      //console.log("Upload Result: ", result);
    });
  }

});
