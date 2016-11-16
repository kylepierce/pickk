DeepLinkHandler = function (data) {
  if (data) {
    Session.set("deepLinked", data);
    return data
  } else {
    console.log('No data found');
  }
} 