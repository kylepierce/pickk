UsersProfileSchema = new SimpleSchema({
  username: {
    label: "Username",
    type: String,
    min: 3,
    max: 16,
    regEx: /^[\w\d][\w\d_]+$/i,
    custom: function() {
      if (Meteor.isClient && this.isSet) {
        Meteor.call("isUsernameUnique", this.value, function(error, isUsernameUnique) {
          if (!isUsernameUnique) {
            UsersProfileSchema.namedContext("settings").addInvalidKeys([{name: "username", type: "notUnique"}]);
          }
        });
      }
    }
  },
  firstName: {
    label: "First Name",
    type: String,
    max: 256
  },
  lastName: {
    label: "Last Name",
    type: String,
    max: 256
  },
  birthday: {
    label: "Birthday",
    type: Date,
    max: new Date()
  }
});

UsersProfileSchema.messages({
  // The username must be at least 3 characters long.
  // The username can not be longer than 15 characters.
  regEx: "[label] can only contain letters, numbers and underscores (but shouldn't begin with underscore)",
  notUnique: "Someone already has that username! :("
});
