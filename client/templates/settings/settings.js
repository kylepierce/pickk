Template.settings.events({
  'click [data-action=logout]': function () {
    AccountsTemplates.logout();
    if (Meteor.isCordova) {
      Branch.logout();
    }
    analytics.reset();
    Router.go("/landing")
  },
});
