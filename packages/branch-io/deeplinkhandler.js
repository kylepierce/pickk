DeepLinkHandler = function (data) {
  console.log(data);
  if (data) {
    Session.set("deepLinked", data);
    if (data.$deeplink_path && Meteor.userId()){
      IonLoading.show({
        customTemplate: "Redirecting!..",
        duration: 2500,
      });
    	handleOpenURL(data.$deeplink_path)
    	return data
    }
  } else {
    console.log("User not logged in. Creating a notification object.");
  }
  var deep = Session.get("deepLinked");
  console.log(deep);
}

NonBranchLinkHandler = function(link) {
  if(link.url && Meteor.userId()) {
    IonLoading.show({
      customTemplate: "Redirecting!..",
      duration: 2500,
    });
  	Session.set("nonBranch", link.url);
    //with the leading "/"
  	var route = link.url.slice(7)
		handleOpenURL(route);
  }
}

handleOpenURL = function(url){
  var userId = Meteor.userId();
  if (userId){
    var data = Session.get("deepLinked")
    data["$deeplink_path"] = ""
    Session.set("deepLinked", data);
    console.log(data);
  	Router.go(url)
  } else {
    // create a notification as a session.
  }
}
