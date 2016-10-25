Meteor.users._ensureIndex({"profile.username": 1}, {unique: true, sparse: true, background: true});
Answers._ensureIndex({userId: 1, questionId: 1, gameId: 1}, {unique: true, background: true});