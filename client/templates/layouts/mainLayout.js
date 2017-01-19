Template.skip.events({
  'click [data-action=skip]': function(e, t){
    console.log(this, e, t);
    var groupId = Router.current().params._id
    Router.go('/groups/'+groupId)
  }
});
