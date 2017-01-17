Template._editGroup.created = function() {
  IonPopover.hide();
};

Template._editGroup.helpers({
  group: function() {
    var groupId = Session.get('groupId');
    return Groups.findOne({_id: groupId})
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
  },
  'checkPrivacy': function(value){
    var groupId = Session.get('groupId');
    var group = Groups.findOne({_id: groupId});
    return group.secret == value;
  }
});

Template._editGroup.events({
  'submit form': function (event, template) {
    event.preventDefault();
    var id = Session.get('groupId');
    var groupName = event.target.groupName.value;
		var privacySetting = template.find('input:radio[name=privacy]:checked').value
    var desc = event.target.groupDesc.value;
    var uniqueGroupName = Groups.findOne({'name': groupName});
    var currentGroup = Groups.findOne({_id: id});

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
    } else if(uniqueGroupName && (currentGroup.name != groupName)){
      IonLoading.show({
        customTemplate: '<h3>That name has been already taken :(</h3>',
        duration: 1500,
        backdrop: true 
      });
    } else {
      // Create the group with group name and privacy check the user passed
      Meteor.call('editGroup', id, groupName, privacySetting, desc);
      IonModal.close();
      sAlert.success("Group Updated" , {effect: 'slide', position: 'bottom', html: true});

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
      Meteor.call('setGroupAvatar', Session.get('groupId'), result);
    });
  }

});
