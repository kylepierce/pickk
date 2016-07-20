var settings = Meteor.settings.private.mailgunApi
var mg = new Mailgun( { apiKey: settings.apiKey, domain: settings.domain } )
var domain = settings.domain
var listAddress = "hi@" + domain
var list = mg.api.lists( listAddress );
