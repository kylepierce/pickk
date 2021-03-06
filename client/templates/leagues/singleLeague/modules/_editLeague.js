AutoForm.addHooks(['updateLeague'], {
  onSuccess: function(insertDoc, updateDoc, currentDoc) {
    this.event.preventDefault();
    sAlert.success("Updated Group!", {effect: 'slide', position: 'bottom', html: true});
    IonModal.close();
  }
});

Template._editLeague.created = function() {
  IonPopover.hide();
};

Template._editLeague.helpers({
  // group: function() {
  //   var groupId = Session.get('groupId');
  //   return Groups.findOne({_id: groupId})
  // },
  // 'groupName': function(){
  //   var groupId = Session.get('groupId');
  //   var group = Groups.findOne({_id: groupId});
  //   return group.name
  // },
  // 'desc': function(){
  //   var groupId = Session.get('groupId');
  //   var group = Groups.findOne({_id: groupId});
  //   return group.desc
  // },
  // 'checkPrivacy': function(value){
  //   var groupId = Session.get('groupId');
  //   var group = Groups.findOne({_id: groupId});
  //   return group.secret == value;
  // },
  'groupData': function(){
    var groupId = Router.current().params._id
    var group = Groups.findOne({_id: groupId})
    return group
  }
});

Template._editLeague.events({
  'click [data-action=update]': function(){

    // sAlert.success("Updated Group!", {effect: 'slide', position: 'bottom', html: true});
    // IonModal.close();
  }
});
