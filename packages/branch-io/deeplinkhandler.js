DeepLinkHandler = function (data) {
  if (data) {
    Session.set("deepLinked", data);
    return data
  } else {
    console.log('No data found');
  }
} 

NonBranchLinkHandler = function(link) {
	console.log("first", link.url)
  if(link.url) {
  	Session.set("nonBranch", link.url);
  	console.log("inner", link.url)
		handleOpenURL(link.url);
  }
}

handleOpenURL = function(url){
	var route = url.slice(7)
	console.log(route)
	Router.go(route)
}