if (Meteor.isCordova) {
  var deviceReady = false;

  document.addEventListener('deviceready', function () {
    deviceReady = true;
    var userId = Meteor.userId()
    Branch.setIdentity(userId)

    Branch.initSession();
    var data = Session.get("deepLinked");
    var nonBranch = Session.get("nonBranch");
    if (nonBranch){
      handleOpenURL(nonBranch);
      Session.set("nonBranch", "");
    }
  })
}
