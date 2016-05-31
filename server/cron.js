SyncedCron.config({
  log: true,
  utc: true
});

SyncedCron.add({
  name: 'Run activateDailyPickks',
  schedule: function(parser) {
    return parser.text("at 16:00"); // UTC timezone
  },
  job: function() {
    Meteor.call("activateDailyPickks");
    Meteor.call("push", "Make Your Daily Diamond Pickks");
  }
});

SyncedCron.add({
  name: 'Run deactivateDailyPickks',
  schedule: function(parser) {
    return parser.text("at 19:00"); // UTC timezone
  },
  job: function() {
    Meteor.call("deactivateDailyPickks");
  }
});

SyncedCron.start();
