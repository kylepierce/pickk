DeepLinkHandler = function (data) {
  if (data) {
    Session.set("deepLinked", data);
    if (data.$deeplink_path){
    	handleOpenURL(data.$deeplink_path)
    	return data
    }
    return data
  } else {
    console.log('No data found');
  }
} 

NonBranchLinkHandler = function(link) {
	console.log("first", link.url)
  if(link.url) {
  	Session.set("nonBranch", link.url);
    //with the leading "/"
  	var route = link.url.slice(7)
		console.log(route)
		handleOpenURL(route);
  }
}

handleOpenURL = function(url){
	Router.go(url)
}