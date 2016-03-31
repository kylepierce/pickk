Template._editGroup.created = function() {
  IonPopover.hide();
};

Template._editGroup.helpers({
  'groupId': function(){
    var groupId = Session.get('groupId');
    var group = Groups.findOne({_id: groupId});
    return group.groupId
  },
  'groupName': function(){
    var groupId = Session.get('groupId');
    var group = Groups.findOne({_id: groupId});
    return group.name
  },
  'desc': function(){
    var groupId = Session.get('groupId');
    var group = Groups.findOne({_id: groupId});
    return group.desc
  }
})

Template._editGroup.events({
  'click input:checkbox':function(event, template){
   if($(event.target).is(':checked')){
        $(this).attr(true);
   }else{
        $(this).attr(false);
   }
    var privateCheck = event.target.value;
  },

  'click input:radio[name=privacy]':function(event, template) {
    $("#submitGroup").prop("disabled", false)
    $("#submitGroup").addClass('button-balanced');
  },

  'submit form': function (event, template) {
    event.preventDefault();
    var id = Session.get('groupId');
    var groupId = event.target.groupId.value;
    var groupName = event.target.groupName.value;
		var privacySetting = template.find('input:radio[name=privacy]:checked').value
    var desc = event.target.groupDesc.value;
    var uniqueGroupName = Groups.findOne({'name': groupName});
    var uniqueGroupId = Groups.findOne({'groupId': groupId});
    var currentGroup = Groups.findOne({_id: id});

    if(privacySetting === "false"){
      privacySetting = false
    }

    function hasWhiteSpace(s) {
      return /\s/g.test(s);
    }

    if(groupId.length < 5){
        IonLoading.show({
        customTemplate: '<h3>That name is not long enough :(</h3>',
        duration: 1500,
        backdrop: true
      });
    } else if(hasWhiteSpace(groupId)){
      IonLoading.show({
        customTemplate: '<h3>Group name can not have spaces :(</h3>',
        duration: 1500,
        backdrop: true
      });
    } else if(groupName.length < 5){
      IonLoading.show({
        customTemplate: '<h3>Group display name not long enough :(</h3>',
        duration: 1500,
        backdrop: true
      });
    } else if(uniqueGroupId && (currentGroup.groupId != groupId)){
      IonLoading.show({
        customTemplate: '<h3>That Id has been already taken :(</h3>',
        duration: 1500,
        backdrop: true 
      });
    } else if(uniqueGroupName && (currentGroup.name != groupName)){
      IonLoading.show({
        customTemplate: '<h3>That name has been already taken :(</h3>',
        duration: 1500,
        backdrop: true 
      });
    } else {
      // Create the group with group name and privacy check the user passed
      Meteor.call('editGroup', id, groupId, groupName, privacySetting, desc);
      IonModal.close();
      sAlert.success("Group Updated" , {effect: 'slide', position: 'bottom', html: true});

    }
  }
});