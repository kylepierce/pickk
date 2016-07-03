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

var setIsOnboarded = function() {
  Meteor._debug("[setIsOnboarded] Running");
  Meteor.users.update({}, {$set: {"profile.isOnboarded": true}}, {multi: true});
  Meteor._debug("[setIsOnboarded] Done");
};

var clearBirthdays = function() {
  Meteor._debug("[clearBirthdays] Running");
  Meteor.users.update({}, {$unset: {"profile.birthday": 0}}, {multi: true});
  Meteor._debug("[clearBirthdays] Done");
};

var normalizeQuestionsCollection = function() {
  Meteor._debug("[normalizeQuestionsCollection] Running");
  // TODO: ask Kyle about it
  // QuestionList.update({commercial: null}, {$unset: {usersAnswered: 0}}, {multi: true});
  QuestionList.remove("oSkEEYv8wTMKzfYQp"); // gameId contains an object // also, que: 'Upload a photo to make it easier for your friends to find you. Change your photo in settings!'
  Meteor._debug("[normalizeQuestionsCollection] Done");
};

var createAnswersCollection = function() {
  Meteor._debug("[createAnswersCollection] Running");
  if (Meteor.settings.public.isDebug) {
    Answers.remove({});
  }
  var question, answer, counter = 0;
  Meteor.users.find().forEach(function(user) {
    if (!user.questionAnswered) {
      return;
    }
    for (var i = 0; i < user.questionAnswered.length; i++) {
      answer = user.questionAnswered[i];
      if (answer.questionId === "oSkEEYv8wTMKzfYQp") {
        continue; // see normalizeQuestionsCollection
      }
      try {
        check(answer, {
          questionId: String,
          answered: String,
          wager: Match.Optional(String),
          description: Match.Optional(String)
        });
      } catch (e) {
        Meteor._debug(answer);
        throw e;
      }
      question = QuestionList.findOne(answer.questionId);
      try {
        check(question, {
          _id: String,
          que: String,
          gameId: String,
          playerId: Match.Optional(String),
          createdBy: String,
          dateCreated: Date,
          active: Boolean,
          commercial: Match.Optional(Match.OneOf(null, true, false)),
          binaryChoice: Match.Optional(Boolean),
          atBatQuestion: Match.Optional(Boolean),
          options: Object,
          usersAnswered: [String],
          play: String
        });
      } catch (e) {
        Meteor._debug(question);
        throw e;
      }
      Answers.insert({
        userId: user._id,
        gameId: question.gameId,
        questionId: answer.questionId,
        answer: answer.answered,
        wager: answer.wager || 0,
        multiplier: 0,
        description: answer.description || ""
      })
    }
    if (counter && counter % 100 === 0) {
      Meteor._debug("[createAnswersCollection] Processed " + counter + " users");
    }
    counter++;
  });
  Meteor._debug("[createAnswersCollection] Done");
};

var dropAnswerFields = function() {
  Meteor._debug("[dropAnswerFields] Running");
  Meteor.users.update({}, {$unset: {questionAnswered: 0}}, {multi: true});
  QuestionList.update({}, {$unset: {usersAnswered: 0}}, {multi: true});
  Meteor._debug("[dropAnswerFields] Done");
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

Migrations.add({
  version: version++,
  up: setIsOnboarded
});

Migrations.add({
  version: version++,
  up: clearBirthdays
});

Migrations.add({
  version: version++,
  up: normalizeQuestionsCollection
});

Migrations.add({
  version: version++,
  up: createAnswersCollection
});

Migrations.add({
  version: version++,
  up: dropAnswerFields
});

// temporary conditions, should be removed after all migrations pass
if (!Meteor.settings.migrations || ~Meteor.settings.migrations.indexOf("cleanUsernames")) Meteor.startup(cleanUsernames);
if (!Meteor.settings.migrations || ~Meteor.settings.migrations.indexOf("unsetDuplicateUsernames")) Meteor.startup(unsetDuplicateUsernames);
if (!Meteor.settings.migrations || ~Meteor.settings.migrations.indexOf("setUsernames")) Meteor.startup(setUsernames);
if (!Meteor.settings.migrations || ~Meteor.settings.migrations.indexOf("setIsOnboarded")) Meteor.startup(setIsOnboarded);
if (!Meteor.settings.migrations || ~Meteor.settings.migrations.indexOf("clearBirthdays")) Meteor.startup(clearBirthdays);
if (!Meteor.settings.migrations || ~Meteor.settings.migrations.indexOf("normalizeQuestionsCollection")) Meteor.startup(normalizeQuestionsCollection);
if (!Meteor.settings.migrations || ~Meteor.settings.migrations.indexOf("createAnswersCollection")) Meteor.startup(createAnswersCollection);
if (!Meteor.settings.migrations || ~Meteor.settings.migrations.indexOf("dropAnswerFields")) Meteor.startup(dropAnswerFields);

