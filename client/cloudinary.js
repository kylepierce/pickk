Meteor.startup(function () {
  $.cloudinary.config(Meteor.settings.public.cloudinary);
});