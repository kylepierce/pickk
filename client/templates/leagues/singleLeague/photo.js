Template.leaguePhoto.events({
  "change #leagueAvatar": function(e, t) {
    var files = e.currentTarget.files;
    t.$(".loading").show();
    t.$(".avatar").hide();

    IonLoading.show({
      customTemplate: "Uploading...",
      duration: 5000,
      backdrop: true
    });

    Cloudinary.upload(files, {
      folder: "league avatar",
      transformation: [
        {width: 200, height: 200, gravity: "face", crop: "lfill"},
      ],
      fields: {}
    }, function(error, result) {
      t.$(".loading").hide();
      t.$(".avatar").show();
      if (error) {
        var leagueId = Router.current().params._id
        analytics.track("User Upload Photo", {
          location: "League",
          success: false,
          leagueId: leagueId
        });
        sAlert.error("Error: " + error.error.message , {effect: 'slide', position: 'bottom', html: true});
      }
      var leagueId = Router.current().params._id;

      Meteor.call('setLeagueAvatar', leagueId, result.secure_url, function(error){
        if(error){
          var leagueId = Router.current().params._id
          analytics.track("User Upload Photo", {
            location: "League",
            success: false,
            leagueId: leagueId
          });
          sAlert.error("Error: " + error , {effect: 'slide', position: 'bottom', html: true});
        } else {
          var leagueId = Router.current().params._id
          analytics.track("User Upload Photo", {
            location: "League",
            success: true,
            leagueId: leagueId
          });
          Router.go('/league/association/' + leagueId);
        }
      });
    });
  },
});