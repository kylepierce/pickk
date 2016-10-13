Cloudinary.config({
	cloud_name: Meteor.settings.public.cloudinary.cloud_name,
	api_key: Meteor.settings.private.cloudinary.api_key,
	api_secret: Meteor.settings.private.cloudinary.api_secret,
});