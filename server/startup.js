var fs = Npm.require('fs');

Meteor.startup(function() {
  var databaseReset = !Migrations._collection.findOne("control");
  if (databaseReset) {
    Fixtures.insertAll([]);
  } else {
    Fixtures.ensureAll([]);
  }
  migrate();
});

process.on("SIGUSR2", Meteor.bindEnvironment(function() {
  var err, filename, reloadedCollectionNames;
  filename = "/tmp/meteorReloadedCollectionNames";
  try {
    fs.statSync(filename);
  } catch (_error) {
    err = _error;
    if (err.code === "ENOENT") {
      return;
    }
  }
  reloadedCollectionNames = _.compact(fs.readFileSync(filename).toString().split("\n"));
  console.info("Reloading fixtures for " + (reloadedCollectionNames.length ? reloadedCollectionNames.join(", ") : "all collections"));
  Fixtures.insertAll(reloadedCollectionNames);
  return migrate();
}));
