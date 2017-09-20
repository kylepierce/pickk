QuestionTemplate = new Meteor.Collection('questionTemplate');

QuestionTemplate.attachSchema(new SimpleSchema({
  sport: {
    label: "Sport",
    type: String,
    allowedValues: ['NFL', 'MLB', 'NBA'],
    autoform: {
      options: [
        {label: "NFL", value: "NFL"},
        {label: "MLB", value: "MLB"},
        {label: "NBA", value: "NBA"}
      ]
    }
  },
  length: {
    label: "Length of Question?",
    type: String,
    allowedValues: ['drive', 'period', 'half', 'game'],
    autoform: {
      options: [
        {label: "Drive", value: "drive"},
        {label: "Period", value: "period"},
        {label: "Half", value: "half"},
        {label: "Game", value: "game"},
      ]
    }
  },
  type: {
    label: "Type of Question",
    type: String,
    allowedValues: ['freePickk', 'prop'],
    autoform: {
      options: [
        {label: "Free Pickk", value: "freePickk"},
        {label: "Prop", value: "prop"}
      ]
    }
  },
  que: {
    label: "Question",
    type: String,
  },
  options: {
    label: "Option",
    type: [Object],
    min: 2,
    max: 6,
  },
  'options.$': {
    type: Object
  },
  'options.$.title': {
    label: "Title",
    type: String,
  },
  'options.$.low': {
    label: "Min Multiplier",
    type: Number,
    decimal: true,
    optional: true
  },
  'options.$.high': {
    label: "Max Multiplier",
    type: Number,
    decimal: true,
    optional: true
  },
  'options.$.multiplier': {
    label: "Multiplier",
    type: Number,
    decimal: true,
    optional: true
  },
  'options.$.requirements': {
    label: "Requirements",
    type: String,
    optional: true,
    defaultValue: null
  }
}));

Schema.optionCreation = new SimpleSchema({

})

QuestionTemplate.allow({
  insert: function(userId, doc) {
    console.log(userId, doc);
    return !! userId;
  },
  update: function(userId, doc) {
    console.log(userId, doc);
    return !! userId;
  },
  remove: function(userId, doc){
    return !! userId;
  }
});
