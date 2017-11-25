DeepLinkHandler = function (data) {
  if (data) {
    Session.set("deepLinked", data);
    if (data.$deeplink_path && !Meteor.userId()) {
      if (data.$deeplink_path.includes('reset-password/')){
        IonLoading.show({
          customTemplate: "Redirecting!..",
          duration: 2500,
        });
        // console.log(data)
        handleNonUserOpenURL(data.$deeplink_path)
      }
    } else if (data.$deeplink_path && Meteor.userId()){
      IonLoading.show({
        customTemplate: "Redirecting!..",
        duration: 2500,
      });
    	handleOpenURL(data.$deeplink_path)
    	return data
    }
  }
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
  	Router.go(url)
  } else {
    console.log("user >>> ", url)
    // create a notification as a session.
  }
}

handleNonUserOpenURL = function (url) {
  var data = Session.get("deepLinked")
  data["$deeplink_path"] = ""
  Session.set("deepLinked", data);
  console.log("Non user >>> ", url)
  Router.go(url)
}
