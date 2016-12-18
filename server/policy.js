// BrowserPolicy.content.disallowEval();
// BrowserPolicy.content.allowFontDataUrl();
// BrowserPolicy.content.allowInlineStyles();
// BrowserPolicy.content.allowOriginForAll('*');
// BrowserPolicy.content.allowOriginForAll('ws://nexus-websocket-a.intercom.io');
// BrowserPolicy.content.allowOriginForAll('wss://nexus-websocket-a.intercom.io');
// BrowserPolicy.content.allowOriginForAll('ws://nexus-websocket-b.intercom.io');
// BrowserPolicy.content.allowOriginForAll('wss://nexus-websocket-b.intercom.io');
// BrowserPolicy.content.allowOriginForAll('res.cloudinary.com');
// BrowserPolicy.content.allowOriginForAll('pickk.co');
// BrowserPolicy.content.allowOriginForAll('cdn.astronomer.io');
//
// var trusted = [
//   'api.astronomer.io',
//   'fonts.gstatic.com',
//   'cdn.astronomer.io',
//   '*.googleapis.com',
//   '*.mxpnl.com',
//   '*.cloudfront.net',
//   'd24n15hnbwhuhn.cloudfront.net',
//   '*.google-analytics.com',
//   '*.intercom.io',
//   '*.intercomcdn.com',
//   '*.facebook.com',
//   'pbs.twimg.com',
//   '*.fbcdn.net',
//   '*.google-analytics.com',
//   '*.mxpnl.com'
// ];
//
// _.each(trusted, function(origin) {
//   https = "https://" + origin;
//   http = "http://" + origin;
//   BrowserPolicy.content.allowOriginForAll(http);
//   BrowserPolicy.content.allowOriginForAll(https);
// });
