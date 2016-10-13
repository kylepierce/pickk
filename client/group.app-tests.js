// if (Meteor.isClient) {


//   beforeEach(function() {
//     Meteor.subscribe('groups')
//     return Promise.resolve()
//       .then(denodeify(function(callback) {return Meteor.call('xolvio:cleaner/resetDatabase', null, callback)}))
//       .then(denodeify(function(callback) {return Meteor.call('pickk/populateDatabase', null, callback)}))
//   });

//   describe('Groups', function() {
//     it('Create Group', function() {
//       let groupId= 'testpickk'
//       let groupName= 'testpickkgroupname'
//       let privacySetting= 'private'
//       Meteor.loginWithToken('CharlieDalton');
//       return Promise.resolve()
//         .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
//         .then(denodeify(Tracker.afterFlush))
//         .then(denodeify(function(callback) {return Meteor.call('createGroup', groupId, groupName, privacySetting, callback)}))
//         .then(function() {
//           assert.equal(Groups.findOne({'name': groupName}).name, groupName);
//         });
//     })

//     it('Unique Group', function() {
//       let groupId= 'testpickk'
//       let groupName= 'testpickkgroupname'
//       let privacySetting= 'private'
//       Meteor.loginWithToken('CharlieDalton');
//       return Promise.resolve()
//         .then(waitFor(function() {return DDP._allSubscriptionsReady()}))
//         .then(denodeify(Tracker.afterFlush))
//         .then(denodeify(function(callback) {return Meteor.call('createGroup', groupId, groupName, privacySetting, callback)}))
//         .then(denodeify(function(callback) {return Meteor.call('createGroup', groupId, groupName, privacySetting, callback)}))
//         .then(function() {
//           assert.equal(Groups.find({'name': groupName}).count(), groupName);
//         });
//     })

//   })
// }
