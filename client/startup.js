Meteor.startup(function () {
  AutoForm.setDefaultTemplate('ionic');
  Session.set('chatLimit', 10);
  Session.set("reactToMessageId", null);

  sAlert.config({
    effect: 'stackslide',
    position: 'bottom',
    timeout: 5000,
    html: false,
    onRouteClose: true,
    stack: false,
    offset: 0,
    beep: false
  });
});
