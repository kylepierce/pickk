//Groups Schema
Groups = new Meteor.Collection('groups');

Groups.attachSchema(new SimpleSchema({
  name: {
    label: "League Name",
    type: String,
    min: 5,
    max: 16,
    regEx: /^[\w\d][\w\d_]+$/i
  },
  secret: {
    label: "Display Settings",
    type: String,
    allowedValues: ['Private', 'Invite Only', 'Public'],
    autoform: {
      options: [
        {label: "Private", value: "Private"},
        {label: "Invite Only", value: "Invite Only"},
        {label: "Public", value: "Public"}
      ]
    }
  },
  skill: {
    label: "Skill Level Required",
    type: Array,
    allowedValues: ['All', 'JV', 'Varsity', 'Semi-Pro', 'Pro', 'All Pro'],
    autoform: {
      options: function () {
        return _.map(['All', 'JV', 'Varsity', 'Semi-Pro', 'Pro', 'All Pro'], function (i) {
          return {label:  i, value: i};
        });
      }
    }
  },
  'skill.$': {
    type: String
  },
  avatar: {
    label: "Avatar",
    type: String,
    autoValue: function(){ return "" }
  },
  commissioner: {
    type: String,
    autoValue: function(){
      if ( this.isInsert ) {
        return this.userId
      }
    },
  },
  dateCreated: {
    type: Date,
    autoValue: function(){
      if ( this.isInsert ) {
        return new Date;
      }
     }
  },
  members: {
    type: Array,
    autoValue: function(){
      if ( this.isInsert ) {
        return [this.userId]
      }
    },
    optional: true
  },
  'members.$': {
    type: String,
    optional: true
  },
  invites: {
    type: Array,
    autoValue: function(){
      if ( this.isInsert ) {
        return []
      }
    },
    optional: true
  },
  'invites.$': {
    type: String,
    optional: true
  },
}));

// Groups.attachSchema(GroupsSchema)
//
// GroupsSchema.messages({
//   notUnique: "Someone already used this group name! :("
// });

Groups.allow({
  insert: function(userId, doc) {
    return !! userId;
  },
  update: function(userId, doc) {
    return !! userId;
  },
  remove: function(userId, doc){
    return !! userId;
  }
});
