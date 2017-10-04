Hero = new Meteor.Collection('hero');

Hero.attachSchema(new SimpleSchema({
  name: {
    label: "Hero Name",
    type: String,
  },
  title: {
    label: "Title",
    type: String,
  },
  description: {
    label: "Description",
    type: String,
  },
  location: {
    label: "Display Location",
    type: Array,
    allowedValues: ['home', 'league', 'matchup'],
    autoform: {
      options: [
        {label: "Home", value: "home"},
        {label: "League", value: "league"},
        {label: "Matchup", value: "matchup"}
      ]
    }
  },
  'location.$': {
    type: String,
    optional: true
  },
  time: {
    label: "Limit When Hero Is Shown?",
    type: String,
    allowedValues: ['true', 'false'],
    autoform: {
      options: [
        {label: "No Limit", value: "false"},
        {label: "Select Times", value: "true"}
      ]
    }
  },
  dateStart: {
    type: Date,
    optional: true,
    defaultValue: new Date('2000-01-01')
  },
  dateEnd: {
    type: Date,
    optional: true,
    defaultValue: new Date('2030-01-01')
  },
  active: {
    label: "Is Hero Active?",
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
  },
  important: {
    label: "Is Hero important?",
    type: Boolean,
    allowedValues: [true, false],
  },
}));

Hero.allow({
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

//
// {
//   "_id": {
//     "_str": "57b82b4773a0133f37fd2c49"
//   },
//   "active": true,
//   "image": "https://pickk.co/wp-content/uploads/2016/06/CID160615010_Pirates_at_Mets.jpg",
//   "url": "/games?sport=MLB",
//   "important": true,
//   "text": "MLB Games"
// }
