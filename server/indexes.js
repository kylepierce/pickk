Meteor.users._ensureIndex({"profile.username": 1}, {unique: true, background: true});
