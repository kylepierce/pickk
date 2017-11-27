Template.leaguePhoto.events({
  'click [data-action=selectSports]': function(e, t){
    Router.go('/league/association/' + this.league._id);
  },
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
        sAlert.error("Error: " + error.error.message , {effect: 'slide', position: 'bottom', html: true});
      }
      var leagueId = Router.current().params._id;

      Meteor.call('setLeagueAvatar', leagueId, result.secure_url, function(error){
        if(error){
          sAlert.error("Error: " + error , {effect: 'slide', position: 'bottom', html: true});
        } else {
          var leagueId = Router.current().params._id
          Router.go('/league/association/' + leagueId);
        }
      });
    });
  },
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
