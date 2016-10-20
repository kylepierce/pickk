SimpleSchema.debug = true;

var currentStep = new ReactiveVar('');
var stepsToDo = [];   // Start with sports selection, and then add selected teams 

var hooksObj = {
  onSubmit: function (insertDoc, updateDoc, currentDoc) {
    this.event.preventDefault();
    var done = this.done;

    if (!updateDoc['$set']) {
      done(new Error('Invalid selection'));
      return false;
    }

    var selectionArray = updateDoc['$set'][currentStep.get()];

    if (currentStep.get() === 'favoriteSports') {
      stepsToDo = selectionArray;   // Used to move to next step
    }

    Meteor.call('updateFavorites', selectionArray, currentStep.get(), function(error) {
      if (error) {
        done(error);
      } else {
        done();
        moveNextStep();
      }
    });
    done();
    return false;
  }
};

AutoForm.addHooks(['favoriteSports', 'favoriteMLBTeams', 'favoriteNFLTeams'], hooksObj);

Template.favoriteTeams.onCreated(function (){
  this.allSteps = [ 'favoriteSports', 'favoriteMLBTeams', 'favoriteNFLTeams'];
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
  }
});

var moveNextStep = function () {
  var step = stepsToDo.pop();
  if (step) {
    currentStep.set('favorite' + step + 'Teams'); 
    $('.header-text').text('Teams');
  } else {
    // End of steps
    if (Meteor.user().profile.isOnboarded) {
      Router.go('/');
    } else {
      Router.go('/');
    }
  }
}
