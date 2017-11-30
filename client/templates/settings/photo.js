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
      if (error) {
        sAlert.error("Error: " + error, { effect: 'slide', position: 'bottom', html: true });
        analytics.track("User Upload Photo", {
          location: "Settings",
          success: false,
        });
      }

      Meteor.users.update(Meteor.userId(), {$set: {"profile.avatar": result}}, function(error){
        if(error){
          analytics.track("User Upload Photo", {
            location: "Settings",
            success: false,
          });
          sAlert.error("Error: " + error , {effect: 'slide', position: 'bottom', html: true});
        } else {
          analytics.track("User Upload Photo", {
            location: "Settings",
            success: true,
          });
          // Router.go('/newUserFavoriteTeams');
          Router.go('/');
        }
      });
    });
  }
});