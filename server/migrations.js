var version = 1;

var cleanUsernames = function() {
  Meteor._debug("[" + new Date().toISOString() + "] [cleanUsernames] Running");
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
      Meteor._debug("[" + new Date().toISOString() + "] [cleanUsernames] Processed " + processedUsernames.length + " usernames");
    }
  });
  Meteor._debug("[" + new Date().toISOString() + "] [cleanUsernames] Done");
};

var unsetDuplicateUsernames = function() {
  Meteor._debug("[" + new Date().toISOString() + "] [unsetDuplicateUsernames] Running");
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
      Meteor._debug("[" + new Date().toISOString() + "] [unsetDuplicateUsernames] " + username + ": " + result);
    }

    if (processedUsernames.length % 100 === 0) {
      Meteor._debug("[" + new Date().toISOString() + "] [unsetDuplicateUsernames] Processed " + processedUsernames.length + " usernames");
    }
  });
  Meteor._debug("[" + new Date().toISOString() + "] [unsetDuplicateUsernames] Done");
};

var setUsernames = function() {
  Meteor._debug("[" + new Date().toISOString() + "] [setUsernames] Running");
  var counter = 1;
  Meteor.users.find({"profile.username": {$exists: false}}).forEach(function(user) {
    Meteor._debug("[" + new Date().toISOString() + "] [setUsernames] #" + user._id + ": no username");
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
        Meteor._debug("[" + new Date().toISOString() + "] [setUsernames] #" + user._id + ": trying " + username);
        if (!Meteor.users.findOne({"profile.username": new RegExp("^" + escapeRegExp(username) + "$", "i")})) {
          Meteor._debug("[" + new Date().toISOString() + "] [setUsernames] #" + user._id + ": assigning " + username);
          Meteor.users.update(user._id, {$set: {"profile.username": username}});
          return; // process next user
        }
      }
    }
  });
  Meteor._debug("[" + new Date().toISOString() + "] [setUsernames] Done");
};

var setIsOnboarded = function() {
  Meteor._debug("[" + new Date().toISOString() + "] [setIsOnboarded] Running");
  Meteor.users.update({}, {$set: {"profile.isOnboarded": true}}, {multi: true});
  Meteor._debug("[" + new Date().toISOString() + "] [setIsOnboarded] Done");
};

var clearBirthdays = function() {
  Meteor._debug("[" + new Date().toISOString() + "] [clearBirthdays] Running");
  Meteor.users.update({}, {$unset: {"profile.birthday": 0}}, {multi: true});
  Meteor._debug("[" + new Date().toISOString() + "] [clearBirthdays] Done");
};

var normalizeQuestionsCollection = function() {
  Meteor._debug("[" + new Date().toISOString() + "] [normalizeQuestionsCollection] Running");
  Questions.remove({que: null});
  Questions.remove({gameId: {$exists: false}});
  Questions.remove({gameId: null});
  Questions.find({"gameId._id": {$exists: true}}).forEach(function(question) {
    Questions.update(question._id, {$set: {gameId: question.gameId._id}})
  });
  Questions.update({}, {$pull: {usersAnswered: null}}, {multi: true});
  Questions.update({}, {$unset: {icons: 0}}, {multi: true});
  Meteor._debug("[" + new Date().toISOString() + "] [normalizeQuestionsCollection] Done");
};

var createAnswersCollection = function() {
  Meteor._debug("[" + new Date().toISOString() + "] [createAnswersCollection] Running");
  if (Meteor.settings.public.isDebug) {
    Answers.remove({});
  }
  var question, answer, existingAnswer, i, counter = 0;
  Meteor.users.find().fetch().map(function(user) {
    if (!user.questionAnswered) {
      return;
    }
    var answers = [];
    for (i = 0; i < user.questionAnswered.length; i++) {
      answer = user.questionAnswered[i];
      try {
        check(answer, {
          questionId: String,
          answered: String,
          wager: Match.Optional(String),
          description: Match.Optional(Match.OneOf(null, String))
        });
        if (answer.wager && isNaN(answer.wager)) {
          throw new Error("answer.wager is NaN");
        }
        existingAnswer = _.findWhere(answers, {questionId: answer.questionId});
        if (existingAnswer) {
          _.extend(existingAnswer, answer); // overwrite fields
        } else {
          answers.push(answer);
        }
      } catch (e) {
        Meteor._debug(answer);
        throw e;
      }
    }
    for (i = 0; i < answers.length; i++) {
      answer = answers[i];
      question = Questions.findOne(answer.questionId);
      if (!question) {
        continue;
      }
      try {
        check(question, {
          _id: String,
          que: String,
          gameId: String,
          playerId: Match.Optional(String),
          createdBy: String,
          dateCreated: Date,
          active: Match.OneOf(null, true, false, "future", "pending"),
          commercial: Match.Optional(Match.OneOf(null, true, false)),
          binaryChoice: Match.Optional(Boolean),
          atBatQuestion: Match.Optional(Boolean),
          options: Object,
          usersAnswered: [String],
          play: Match.Optional(String) // absent for un-resolved questions
        });
        if (question.options[answer.answered].multiplier && isNaN(question.options[answer.answered].multiplier)) {
          throw new Error("question.options[answer.answered].multiplier is NaN");
        }
      } catch (e) {
        Meteor._debug(question);
        throw e;
      }
      Answers.insert({
        userId: user._id,
        gameId: question.gameId,
        questionId: answer.questionId,
        answered: answer.answered,
        wager: parseInt(answer.wager || "0", 10),
        multiplier: parseFloat(question.options[answer.answered].multiplier || "0"),
        description: answer.description || ""
      }, function(error) {
        if (error) {
          throw error;
        }
      });
    }
    if (counter && counter % 100 === 0) {
      Meteor._debug("[" + new Date().toISOString() + "] [createAnswersCollection] Processed " + counter + " users");
    }
    counter++;
  });
  Meteor._debug("[" + new Date().toISOString() + "] [createAnswersCollection] Done");
};

var dropAnswerFields = function() {
  Meteor._debug("[" + new Date().toISOString() + "] [dropAnswerFields] Running");
  Meteor.users.update({}, {$unset: {questionAnswered: 0}}, {multi: true});
  Questions.update({}, {$unset: {"options.option1.usersPicked": 0}}, {multi: true});
  Questions.update({}, {$unset: {"options.option2.usersPicked": 0}}, {multi: true});
  Questions.update({}, {$unset: {"options.option3.usersPicked": 0}}, {multi: true});
  Questions.update({}, {$unset: {"options.option4.usersPicked": 0}}, {multi: true});
  Questions.update({}, {$unset: {"options.option5.usersPicked": 0}}, {multi: true});
  Questions.update({}, {$unset: {"options.option6.usersPicked": 0}}, {multi: true});
  Meteor._debug("[" + new Date().toISOString() + "] [dropAnswerFields] Done");
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
if (~Meteor.settings.private.migrations.indexOf("cleanUsernames")) Meteor.startup(cleanUsernames);
if (~Meteor.settings.private.migrations.indexOf("unsetDuplicateUsernames")) Meteor.startup(unsetDuplicateUsernames);
if (~Meteor.settings.private.migrations.indexOf("setUsernames")) Meteor.startup(setUsernames);
if (~Meteor.settings.private.migrations.indexOf("setIsOnboarded")) Meteor.startup(setIsOnboarded);
if (~Meteor.settings.private.migrations.indexOf("clearBirthdays")) Meteor.startup(clearBirthdays);
if (~Meteor.settings.private.migrations.indexOf("normalizeQuestionsCollection")) Meteor.startup(normalizeQuestionsCollection);
if (~Meteor.settings.private.migrations.indexOf("createAnswersCollection")) Meteor.startup(createAnswersCollection);
if (~Meteor.settings.private.migrations.indexOf("dropAnswerFields")) Meteor.startup(dropAnswerFields);
