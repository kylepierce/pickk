DeepLinkHandler = function  (data) {
  if (data) {
    console.log('Utm: ' + data.utm_source);
    Session.set("deepLinked", data);
    return data
  } else {
    console.log('No data found');
  }
} 