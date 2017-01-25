DeepLinkHandler = function (data) {
  IonLoading.show({
    customTemplate: "Redirecting!..",
    duration: 2500,
    backdrop: true
  });
  if (data) {
    Session.set("deepLinked", data);
    if (data.$deeplink_path){
    	handleOpenURL(data.$deeplink_path)
    	return data
    }
  } else {
    console.log('No data found');
  }
}

NonBranchLinkHandler = function(link) {
  IonLoading.show({
    customTemplate: "Redirecting...",
    duration: 2500,
    backdrop: true
  });
  if(link.url) {
  	Session.set("nonBranch", link.url);
    //with the leading "/"
  	var route = link.url.slice(7)
		handleOpenURL(route);
  }
}

handleOpenURL = function(url){
  var userId = Meteor.userId();
  if (userId){
    Session.set("deepLinked", {});
  	Router.go(url)
  }
}
