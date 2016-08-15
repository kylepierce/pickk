Template.newGroup.events({
  'click input:radio[name=privacy]':function(event, template) {
    $("#submitGroup").prop("disabled", false)
    $("#submitGroup").addClass('button-balanced');
  }
});

Template.newGroup.events({
  'click input:checkbox':function(event, template){
    if($(event.target).is(':checked')){
      $(this).attr(true);
    } else{
      $(this).attr(false);
    }
    
    var privateCheck = event.target.value;
  },

  'submit form': function (event, template) {
    event.preventDefault();
    var groupName = event.target.groupName.value;
		var privacySetting = template.find('input:radio[name=privacy]:checked').value

    if(privacySetting === "false"){
      privacySetting = false
    }

    function hasWhiteSpace(s) {
      return /\s/g.test(s);
    }

   if(groupName.length < 5){
      IonLoading.show({
        customTemplate: '<h3>Group display name not long enough :(</h3>',
        duration: 1500,
        backdrop: true
      });
   } else if(groupName.length > 25){
      IonLoading.show({
        customTemplate: '<h3>Group display name too long :(</h3>',
        duration: 1500,
        backdrop: true
      });
    }

    //Group names have to be unique
    else if(uniqueGroupName){
      IonLoading.show({
        customTemplate: '<h3>That name has been already taken :(</h3>',
        duration: 1500,
        backdrop: true
      });
    } else {
    // Create the group with group name and privacy check the user passed
    Meteor.call('createGroup', groupName, privacySetting);

    // Show message on the screen that it was successfully created
    IonLoading.show({
      customTemplate: '<h3>You are the commissioner of ' + groupName + '</h3>',
      duration: 1500,
      backdrop: true
    });

  	Router.go('/groups/');

    // var group = Groups.findOne({'groupId': groupId})
    // var groupLink = "/groups/" + group._id

    // Close
    // Router.go(groupLink);
    }

  }
});
