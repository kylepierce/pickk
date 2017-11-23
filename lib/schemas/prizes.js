Prizes = new Meteor.Collection('prizes');

Prizes.attachSchema(new SimpleSchema({
  name: {
    label: "Internal Name",
    type: String,
  },
  title: {
    label: "Title",
    type: String,
  },
  rank: {
    label: "Rank",
    type: Number,
  },
  dateCreated: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date;
      }
    }
  },
  description: {
    label: "Description",
    type: String,
  },
  type: {
    label: "Who Is able to play?",
    type: String,
    allowedValues: ['global', 'league', 'matchup'],
    autoform: {
      options: [
        { label: "Global", value: "global" },
        { label: "League", value: "league" },
        { label: "Matchup", value: "matchup" }
      ]
    }
  },
  matchupId: {
    type: String,
    optional: true
  },
  leagueId: {
    type: String,
    optional: true
  },
  'type.$': {
    type: String,
    optional: true
  },
  dateStart: {
    type: Date,
    autoform: {
      type: "pickadate"
    },
    defaultValue: new Date('2000-01-01')
  },
  dateEnd: {
    type: Date,
    autoform: {
      type: "pickadate"
    },
    defaultValue: new Date('2030-01-01')
  },
  active: {
    label: "Is Prize Active?",
    type: Boolean,
    allowedValues: [true, false]
  },
  image: {
    label: "Image",
    type: String
  },
  url: {
    label: "Url",
    type: String,
  }
}));

Prizes.allow({
  insert: function (userId, doc) {
    console.log(userId, doc);
    return !!userId;
  },
  update: function (userId, doc) {
    console.log(userId, doc);
    return !!userId;
  },
  remove: function (userId, doc) {
    return !!userId;
  }
});
