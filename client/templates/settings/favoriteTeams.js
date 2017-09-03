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

Template['afCheckboxGroup_ionic2'].events({
  'click .checkbox': function(e,t){
    var input = $("input[id='"+ this.value+"']")[0];

    if (this.selected === true){
      this.selected = false
      $(e.currentTarget).prop('checked', false);
      $(input).attr( 'checked', false )
    } else if (this.selected === false){
      this.selected = true
      $(e.currentTarget).prop('checked', true);
      $(input).attr( 'checked', true )
    }
    console.log(this, input, e, t);
    $(e.currentTarget).toggleClass('play-selected');
  }
});

Template["afCheckboxGroup_ionic2"].helpers({
  img: function(){
    var lower = this.value.toLowerCase()
    var image = "/team-logos/" + lower + ".svg"
    return image
  },
  selected: function(){
    if (this.selected) {
      return "play-selected"
    }
  },
  atts: function selectedAttsAdjust() {
    var atts = _.clone(this.atts);
    if (this.selected) {
      atts.checked = "";
    }
    // remove data-schema-key attribute because we put it
    // on the entire group
    delete atts["data-schema-key"];
    return atts;
  },
  dsk: function dsk() {
    return {
      "data-schema-key": this.atts["data-schema-key"]
    }
  }
});
