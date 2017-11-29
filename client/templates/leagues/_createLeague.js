AutoForm.addHooks(['createLeague'], {
  onSuccess: function(operation, result, template) {
    this.event.preventDefault();
    Router.go("/league/settings/photo/" + result);
  }
});

Template.newLeague.events({
  'click #leagueName': function () {
    analytics.track('Click League Name input', {});
  },
  'click #who': function () {
    analytics.track('Click Who Can Join input', {});
  },
  'click #limit': function () {
    analytics.track('Click Limit input', {});
  },
  'click #createLeague': function () {
    analytics.track('Click Submit Create League', {});
  },
});