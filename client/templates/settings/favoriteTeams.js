// SimpleSchema.debug = true;

var currentStep = new ReactiveVar('');
var currentValue = new ReactiveVar("sports")
var stepsToDo = [];   // Start with sports selection, and then add selected teams

var hooksObj = {
  onSubmit: function (insertDoc, updateDoc, currentDoc) {
    this.event.preventDefault();
    var done = this.done;

    if (!updateDoc['$set']) {
      IonLoading.show({
        customTemplate: "Please Select At Least One... ",
        duration: 1000,
        backdrop: true
      });
      done(new Error('Invalid selection'));
      return false;
    }

    var selectionArray = updateDoc['$set'][currentStep.get()];

    if (currentStep.get() === 'favoriteSports') {
      stepsToDo = selectionArray;   // Used to move to next step
    }
    var type = currentStep.get()
    var userId = Meteor.userId()
    var data = {}
    data.type = selectionArray
    data.userId = userId;

    analytics.identify(userId, data)
    if (Meteor.isCordova) {
      console.log(data)
      intercom.updateUser(data);
    }
    Meteor.call('updateFavorites', selectionArray, type, function(error) {
      if (error) {
        IonLoading.show({
          customTemplate: error,
          duration: 1000,
          backdrop: true
        });
        done(error);
      } else {
        IonLoading.show({
          customTemplate: "Updating Profile",
          duration: 500,
          backdrop: true
        });
        done();
        moveNextStep();
      }
    });
    done();
    return false;
  }
};

AutoForm.addHooks(['favoriteSports', 'favoriteMLBTeams', 'favoriteNFLTeams', 'favoriteNBATeams'], hooksObj);

Template.favoriteTeams.onCreated(function (){
  this.allSteps = [ 'favoriteSports', 'favoriteMLBTeams', 'favoriteNFLTeams', 'favoriteNBATeams'];
  currentStep = new ReactiveVar('favoriteSports');
});


Template.favoriteTeams.helpers({
  allSteps: function () {
    return Template.instance().allSteps;
  },
  UsersProfileSchema: function() {
    return UsersProfileSchema;
  },
  hide: function (step) {
    if (step !== currentStep.get()) {
      return 'hidden';
    }
  },
  submitText: function (e,t) {
    if (this.valueOf() === "favoriteSports"){
      return "Save Favorite Sports"
    } else if (this.valueOf() === "favoriteNBATeams") {
      return "Update Favorite NBA Teams"
    } else if (this.valueOf() === "favoriteMLBTeams") {
      return "Update Favorite MLB Teams"
    } else if (this.valueOf() === "favoriteNFLTeams") {
      return "Update Favorite NFL Teams"
    }
  }
});

var moveNextStep = function () {
  var step = stepsToDo.pop();
  if (step) {
    currentStep.set('favorite' + step + 'Teams');
    currentValue.set(step);
    $('.header-text').text('Teams');
  } else {
    // End of steps
    if (Meteor.user().profile.isOnboarded) {
      Router.go('/');
    } else {
      Meteor.call('onBoarded');
      if (Meteor.isCordova) {
        Router.go('/push-active');
      }
    }
  }
}
