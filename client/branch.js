if (Meteor.isCordova) {
  var deviceReady = false;
  
  document.addEventListener('deviceready', function () {
    var userId = Meteor.userId();
    Branch.setIdentity(userId);
    var data = Session.get("deepLinked");

    deviceReady = true;
    Branch.initSession(); 
    var nonBranch = Session.get("nonBranch");
    if (nonBranch){
      handleOpenURL(nonBranch);
      Session.set("nonBranch", "");
    }
  })
}
