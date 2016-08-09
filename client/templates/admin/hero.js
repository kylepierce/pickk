Template.insertHero.helpers({
    optsDatetimepicker: function() {
      return {
        //WHAT IS STORED (i.e in the database)
        formatValue: 'YYYY-MM-DD'
        pikaday: {
          // what is DISPLAYED (to the user)
          format: 'YYYY-MM-DD h:mmA',
          showTime: true,
        }
      }
    }
  });

SimpleSchema.debug = true;

Template.insertHero.helpers({
  HeroSchema: function() {
    return HeroSchema;
  }
});

AutoForm.hooks({
  insertHero: {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();
      var done = this.done;

      console.log(this)

      // Meteor.call('')

      // if (customHandler(insertDoc)) {
      //   this.done();
      // } else {
      //   this.done(new Error("Submission failed"));
      // }
      // return false;
    }
  }
});