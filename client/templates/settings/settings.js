Template.settings.helpers({
  username: function() {
    var currentUser = Meteor.user();
    if (currentUser.profile.username) {
      return currentUser.profile.username;
    } else if (currentUser.services && currentUser.twitter && currentUser.services.twitter.screenName) {
      return currentUser.services.twitter.screenName;
    } else {
      return "";
    }
  },


  firstName: function() {
    var currentUser = Meteor.user();
    if (currentUser.profile.firstName) {
      return currentUser.profile.firstName;
    } else if (currentUser.services && currentUser.services.facebook && currentUser.services.facebook.first_name) {
      return currentUser.services.facebook.first_name;
    } else {
      return "";
    }
  },


  lastName: function() {
    var currentUser = Meteor.user();
    if (currentUser.profile.lastName) {
      return currentUser.profile.lastName;
    } else if (currentUser.services && currentUser.services.facebook && currentUser.services.facebook.last_name) {
      return currentUser.services.facebook.last_name;
    } else {
      return "";
    }
  },
  
  birthday: function() {
    var currentUser = Meteor.user();
    if (currentUser.profile.birthday) {
      return moment(currentUser.profile.birthday).format("YYYY-MM-DD");
    } else {
      return "";
    }
  }
});

Template.settings.events({
  'click [name=username]': function() {
    $('#usernameReq').css('display', 'block')
  },

  'keyup [name=username]': function(event, template) {
    event.preventDefault();
    var username = event.target.value;

    template.$("[name=username]").css("color", "green");
    template.$("#short").css("color", "green");
    template.$("#long").css("color", "green");
    template.$("#space").css("color", "green");
    template.$("#unique").css("color", "green");

    if (username.length < 3) {
      // Check to make sure the username is longer than 3 characters
      template.$("[name=username]").css("color", "red");
      template.$("#short").css("color", "red");
      template.$("#long").css("color", "green");
    }

    if (username.length > 16) {
      // Check to see that the username is less than 16
      template.$("[name=username]").css("color", "red");
      template.$("#short").css("color", "green");
      template.$("#long").css("color", "red");
    }

    if (hasWhiteSpace(username)) {
      // Check for white space
      template.$("[name=username]").css("color", "red");
      template.$("#space").css("color", "red");
    }

    Meteor.call("isUsernameUnique", username, function(error, isUsernameUnique) {
      if (!isUsernameUnique) {
        template.$("[name=username]").css("color", "red");
        template.$("#unique").css("color", "red");
      }
    });
  },

  'blur [name=username]': function(event, template) {
    template.$('#usernameReq').hide()
  },


  'submit form': function(event) {
    event.preventDefault();
    var currentUserId = Meteor.userId();

    var username = event.target.username.value;
    var firstName = event.target.firstName.value;
    var lastName = event.target.lastName.value;
    var birthday = event.target.birthday.value;
    // var avatar = $('#avatar').prop('src');

    if (username.length < 3) {
      IonLoading.show({
        customTemplate: '<h3>The username must be at least 3 characters long.</h3>',
        duration: 1500,
        backdrop: true
      })
    }
    else if (username.length > 16) {
      IonLoading.show({
        customTemplate: '<h3>The username can not be longer than 15 characters.</h3>',
        duration: 1500,
        backdrop: true
      })
    }
    else if (hasWhiteSpace(username)) {
      IonLoading.show({
        customTemplate: '<h3>The username can not have spaces.</h3>',
        duration: 1500,
        backdrop: true
      })
    }
    else {
      Meteor.call("isUsernameUnique", username, function(error, isUsernameUnique) {
        if (isUsernameUnique) {
          var newAccount = event.target.status.value;
          Meteor.call('updateProfile', currentUserId, username, firstName, lastName, birthday);
          if (newAccount == "Finish Profile") {
            Router.go('/onboarding');
          } else {
            Router.go('/');
          }
        } else {
          IonLoading.show({
            customTemplate: '<h3>Someone already has that username! :(</h3>',
            duration: 1500,
            backdrop: true
          })
        }
      });

    }


  },

  "change input[name='avatar']": function(event, template) {
    var files = event.currentTarget.files;
    template.$(".loading").show();
    template.$(".avatar").hide();
    Cloudinary.upload(files, {
      folder: "avatars",
      transformation: [
        {width: 200, height: 200, gravity: "face", crop: "lfill"},
      ],
      fields: {}
    }, function(error, result) {
      template.$(".loading").hide();
      template.$(".avatar").show();
      if (error) {
        throw error;
      }
      Meteor.users.update(Meteor.userId(), {$set: {"profile.avatar": result}});
      //console.log("Upload Error: ", error);
      //console.log("Upload Result: ", result);
    });
  }

});

function hasWhiteSpace(s) {
  return /\s/g.test(s);
}
