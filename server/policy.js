// BrowserPolicy.content.disallowEval();
// BrowserPolicy.content.allowFontDataUrl();
// BrowserPolicy.content.allowInlineStyles();
// BrowserPolicy.content.allowOriginForAll('*');
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
// Meteor.startup(function () {
//   console.log('Configuring content-security-policy:');
//   BrowserPolicy.content.allowSameOriginForAll();
//   BrowserPolicy.content.allowOriginForAll('http://meteor.local');
//   BrowserPolicy.content.allowOriginForAll('https://pickk.net');
//   BrowserPolicy.content.allowOriginForAll('https://*.pickk.net');
//   BrowserPolicy.content.allowEval();
//   BrowserPolicy.framing.disallow();
// });

// WebApp.connectHandlers.use(function(req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   return next();
// });