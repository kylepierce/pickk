var version = 1;

var cleanUsernames = function() {
  Meteor._debug("[cleanUsernames] Running");
  var processedUsernames = [];
  Meteor.users.find().forEach(function(user) {
    var oldUsername = user.profile.username;
    if (!oldUsername) {
      return;
    }
    var newUsername = oldUsername.replace(/[^\w\d_]/g, "");
    if (oldUsername != newUsername) {
      Meteor.users.update(user._id, {$set: {"profile.username": newUsername}});
    }
    processedUsernames.push(newUsername);
    if (processedUsernames.length % 100 === 0) {
      Meteor._debug("[cleanUsernames] Processed " + processedUsernames.length + " usernames");
    }
  });
  Meteor._debug("[cleanUsernames] Done");
};

var unsetDuplicateUsernames = function() {
  Meteor._debug("[unsetDuplicateUsernames] Running");
  var processedUsernames = [];
  Meteor.users.find().forEach(function(user) {
    var username = user.profile.username;
    if (!username) {
      return;
    }
    var lowercasedUsername = username.toLowerCase();
    if (~processedUsernames.indexOf(lowercasedUsername)) {
      return;
    }
    processedUsernames.push(lowercasedUsername);
    var result = Meteor.users.update({_id: {$ne: user._id}, "profile.username": new RegExp("^" + escapeRegExp(username) + "$", "i")}, {$unset: {"profile.username": 0}}, {multi: true});
    if (result) {
      Meteor._debug("[unsetDuplicateUsernames] " + username + ": " + result);
    }

    if (processedUsernames.length % 100 === 0) {
      Meteor._debug("[unsetDuplicateUsernames] Processed " + processedUsernames.length + " usernames");
    }
  });
  Meteor._debug("[unsetDuplicateUsernames] Done");
};

var setUsernames = function() {
  Meteor._debug("[setUsernames] Running");
  var counter = 1;
  Meteor.users.find({"profile.username": {$exists: false}}).forEach(function(user) {
    Meteor._debug("[setUsernames] #" + user._id + ": no username");
    var username, usernames = [
      user.services && user.services.twitter && user.services.twitter.screenName,
      user.emails && user.emails[0].address.split("@")[0],
      user.services && user.services.facebook && user.services.facebook.email && user.services.facebook.email.split("@")[0],
      user.services && user.services.facebook && user.services.facebook.name && user.services.facebook.name,
      "user" + counter++
    ];
    usernames = _.compact(usernames); // filter out falsy values
    for (var i = 0; i < usernames.length; i++) {
      username = usernames[i].replace(/[^\w\d_]/g, "");
      if (username) {
        Meteor._debug("[setUsernames] #" + user._id + ": trying " + username);
        if (!Meteor.users.findOne({"profile.username": new RegExp("^" + escapeRegExp(username) + "$", "i")})) {
          Meteor._debug("[setUsernames] #" + user._id + ": assigning " + username);
          Meteor.users.update(user._id, {$set: {"profile.username": username}});
          return; // process next user
        }
      }
    }
  });
  Meteor._debug("[setUsernames] Done");
};

Migrations.add({
  version: version++,
  up: cleanUsernames
});

Migrations.add({
  version: version++,
  up: unsetDuplicateUsernames
});

Migrations.add({
  version: version++,
  up: setUsernames
});
