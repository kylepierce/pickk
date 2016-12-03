if (Meteor.isCordova) {
  var deviceReady = false;

  document.addEventListener('deviceready', function () {
    deviceReady = true;
    
    Branch.initSession();
    var data = Session.get("deepLinked");
    var nonBranch = Session.get("nonBranch");
    if (nonBranch){
      handleOpenURL(nonBranch);
      Session.set("nonBranch", "");
    }
    console.log("branch.js", data)
  })
}
