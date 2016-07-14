SimpleSchema.debug = true;

AutoForm.hooks({
  favoriteTeamsForm: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();
      var done = this.done;

      var favTeamsArr = updateDoc['$set'].favoriteTeams;

      console.log("updateDoc: ", favTeamsArr);

      Meteor.call('updateFavoriteTeams', favTeamsArr, function(error) {
        if (error) {
          done(error);
        } else {
          done();
          if (Meteor.user().profile.isOnboarded) {
            Router.go('/');
          } else {
            Router.go('/onboarding');
          }
        }
      });

      done();
      return false;
    }
  }
});


Template.favoriteTeams.helpers({
  UsersProfileSchema: function() {
    return UsersProfileSchema;
  },
  selectizeOptions: function () {
    return {
      maxItems: 3
    }
  }
});