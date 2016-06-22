DDPRateLimiter.addRule({
  name: "addChatMessage",
  userId: function(userId) { return true; }, // Rate limit per userId
}, Meteor.settings.private.rateLimits["addChatMessage"].numRequests, Meteor.settings.private.rateLimits["addChatMessage"].timeInterval);
