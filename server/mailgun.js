var settings = Meteor.settings.private.mailgunApi
var mg = new Mailgun( { apiKey: settings.apiKey, domain: settings.domain } )
var domain = settings.domain
var listAddress = "hi@" + domain
var list = mg.api.lists( listAddress );


Meteor.methods({
  'addToMailingList': function( emailAddress ) {
    check( emailAddress, String );
    var user = Meteor.users.findOne({"emails.address": emailAddress}, {fields: {"emails.address": 1}});
    if ( user ) {
      list.members().create({
        subscribed: true,
        address: emailAddress
      }, function( error, response ) {
        if ( error ) {
          console.log( 'mailgun-error', error );
        } else {
          console.log( response );
        }
      });
    } else {
      console.log( 'bad-email', 'Sorry, you\'re not a registered user.' );
    }
  },
  'facebookAddToMailingList': function( emailAddress ) {
    check( emailAddress, String );
    var user = Meteor.users.findOne({"services.facebook.email": emailAddress}, {fields: {"services.facebook.email": 1}});
    console.log(user)
    if ( user ) {
      list.members().create({
        subscribed: true,
        address: emailAddress
      }, function( error, response ) {
        if ( error ) {
          console.log( 'mailgun-error', error );
        } else {
          console.log( response );
        }
      });
    } else {
      console.log( 'bad-email', 'Sorry, you\'re not a registered user.' );
    }
  },
  'syncExistingUsersToMailgun': function() {
    var users = Meteor.users.find().fetch();
    for( var i = 0; i < users.length; i++ ) {
      if ( typeof users[ i ].services.facebook != "undefined" ) {
        if ( users[ i ].services.facebook.email ) {
          var email = users[ i ].services.facebook.email;
          console.log(email)
          Meteor.call('facebookAddToMailingList', email)
        };
      };
    }
  },
  'sendToMailingList': function(subject, text, html) {
    console.log('sending email to ' + listAddress)
      mg.send({
        from: 'hi@pickk.co',
        to: listAddress,
        subject: subject,
        text: text,
        html: html
      }, function( error, body ) {
        console.log( body );
      });
  },
  'listMembers': function(){
    list.members().list(function(err, members){
      var members = members.items
      for (var i = members.length - 1; i >= 0; i--) {
        var address = members[i].address
        console.log(address)
      };
      
    })
  }
});