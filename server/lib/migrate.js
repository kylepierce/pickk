var version = 1;

migrate = function() {
  var version = Migrations._list.length - 1;
  var control = Migrations._collection.findOne("control");
  if (!control) {
    return Migrations._collection.insert({
      "_id": "control",
      "locked": false,
      "version": version
    });
  } else {
    if (control.version < version) {
      return Migrations.migrateTo("latest");
    }
  }
};
