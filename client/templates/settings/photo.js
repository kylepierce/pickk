Template.userPhoto.events({
  "click [data-action=selectTeam]": function(){
    // Router.go('/newUserFavoriteTeams');
    Router.go('/');
  },
  "change #userAvatar": function(e, t) {
    var files = e.currentTarget.files;
    t.$(".loading").show();
    t.$(".avatar").hide();

    IonLoading.show({
      customTemplate: "Uploading...",
      duration: 5000,
      backdrop: true
    });

    Cloudinary.upload(files, {
      folder: "avatar",
      transformation: [
        {width: 200, height: 200, gravity: "face", crop: "lfill"},
      ],
      fields: {}
    }, function(error, result) {
      t.$(".loading").hide();
      t.$(".avatar").show();
      if (error) {throw error;}

      Meteor.users.update(Meteor.userId(), {$set: {"profile.avatar": result}}, function(error){
        if(error){
          sAlert.error("Error: " + error , {effect: 'slide', position: 'bottom', html: true});
        } else {
          // Router.go('/newUserFavoriteTeams');
          Router.go('/');
        }
      });
    });
  }
});


// Add a analytics code right here
// var route = Router.current().originalUrl
// if(route.includes("newUserSettings")) {
//   var newOrNah = true
// } else {
//   var newOrNah = false
// }
// var currentUser = Meteor.userId();
// analytics.track("userAddAvatar", {
//   id: currentUser,
//   newUser: newOrNah
// });
// console.log("Upload Error: ", error);
// console.log("Upload Result: ", result);
