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

// Template.editProfile.events({
//   "change #new-icon": function(e, t) {
//     var files = e.currentTarget.files;
//     t.$(".loading").show();
//     t.$(".avatar").hide();
//     console.log(files)
//     IonLoading.show({
//       customTemplate: "Uploading...",
//       duration: 5000,
//       backdrop: true
//     });
//     Cloudinary.upload(files, {
//       folder: "avatars",
//       transformation: [
//         {width: 200, height: 200, gravity: "face", crop: "lfill"},
//       ],
//       fields: {}
//     }, function(error, result) {
//       t.$(".loading").hide();
//       t.$(".avatar").show();
//       if (error) {
//         throw error;
//       }
//       Meteor.users.update(Meteor.userId(), {$set: {"profile.avatar": result}});
//       // Add a analytics code right here
//       var route = Router.current().originalUrl
//       if(route.includes("newUserSettings")) {
//         var newOrNah = true
//       } else {
//         var newOrNah = false
//       }
//       var currentUser = Meteor.userId();
//       analytics.track("userAddAvatar", {
//         id: currentUser,
//         newUser: newOrNah
//       });

//       console.log("Upload Error: ", error);
//       console.log("Upload Result: ", result);
//     });
//   }
//
// });
