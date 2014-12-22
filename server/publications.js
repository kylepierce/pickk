 Meteor.publish('posts-recent', function publishFunction() {
   return QL.find({}, {sort: {date: -1}, limit: 1});
 });