Template.skip.events({
  'click [data-action=skip]': function(e, t){
    var groupId = Router.current().params._id
    Router.go('league/'+groupId)
  }
});
