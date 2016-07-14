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
    },
    optional: true
  },
  firstName: {
    label: "First Name",
    type: String,
    max: 256,
    optional: true
  },
  lastName: {
    label: "Last Name",
    type: String,
    max: 256,
    optional: true
  },
  birthday: {
    label: "Birthday",
    type: Date,
    max: new Date(),
    optional: true
  },
  favoriteTeams: {
    label: "Favorite Teams",
    type: [String],
    autoform: {
      type: "selectize",
      multiple: true,
      options: function () {
        return [
          {label: "Team 1", value: 'team1'},
          {label: "Team 2", value: 'team2'},
          {label: "Team 3", value: 'team3'},
          {label: "Team 4", value: 'team4'},
          {label: "Team 5", value: 'team5'},
        ];
      },
      selectizeOptions: {
        hideSelected: true,
        plugins: {
          "remove_button": {}
        }
      }
    },
    optional: true
  }
});

UsersProfileSchema.messages({
  // The username must be at least 3 characters long.
  // The username can not be longer than 15 characters.
  regEx: "[label] can only contain letters, numbers and underscores (but shouldn't begin with underscore)",
  notUnique: "Someone already has that username! :("
});
