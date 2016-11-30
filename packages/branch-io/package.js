Package.describe({
  name: 'pickk:branch-io',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Use branch.io deeplinking in meteor / cordova',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.1.2');
  api.addFiles('deeplinkhandler.js', ['client', 'server']);

  api.export("DeepLinkHandler", ['client', 'server']);
  api.export("NonBranchLinkHandler", ['client', 'server']);
  api.export("handleOpenURL", ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('pickk:branch-io');
  api.mainModule('branch-io-tests.js');
});
