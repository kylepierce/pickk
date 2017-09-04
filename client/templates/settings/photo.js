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
      folder: "group avatar",
      transformation: [
        {width: 200, height: 200, gravity: "face", crop: "lfill"},
      ],
      fields: {}
    }, function(error, result) {
      t.$(".loading").hide();
      t.$(".avatar").show();
      if (error) {throw error;}
      var leagueId = Router.current().params._id;

      Meteor.call('setLeagueAvatar', leagueId, result.secure_url);
    });
  },
  "click [data-action=sports]": function(){
    var leagueId = Router.current().params._id;
    Router.go('/league/association/leagueId');
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
// if(Meteor.isCordova){
//   //Intercom needs unix time with '_at' in JSON to work.
//   var intercomData = {
//     "added_avatar": true,
//     "last_update_avatar": parseInt(Date.now() / 1000),
//     "userId": a.userId,
//   }
//   updateIntercom(intercomData)
// }
// console.log("Upload Error: ", error);
// console.log("Upload Result: ", result);
