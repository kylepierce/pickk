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
  // location: {
  //   label: "Display Location",
  //   type: String,
  //   allowedValues: ['home', 'league', 'matchup'],
  //   autoform: {
  //     options: [
  //       {label: "Home", value: "home"},
  //       {label: "League", value: "league"},
  //       {label: "Matchup", value: "matchup"}
  //     ]
  //   }
  // },
  // dateStart: {
  //   type: Date,
  // },
  // dateEnd: {
  //   type: Date,
  // },
  // image: {
  //   label: "Image",
  //   type: String
  // },
  // url: {
  //   label: "Url",
  //   type: String,
  // },
  // important: {
  //   label: "Important",
  //   type: Boolean,
  // }
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
