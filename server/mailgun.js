var settings = Meteor.settings.private.mailgunApi
var mg = new Mailgun( { apiKey: settings.apiKey, domain: settings.domain } )
var domain = settings.domain
var listAddress = "hi@" + domain
var list = mg.api.lists( listAddress );


Meteor.methods({
  'addToMailingList': function( emailAddress ) {
    check( emailAddress, String );
    var user = Meteor.users.findOne({"emails.address": emailAddress}, {fields: {"emails.address": 1}});
    console.log(user)
    if ( user ) {
      console.log('Found User')
      list.members().create({
        subscribed: true,
        address: emailAddress
      }, function( error, response ) {
        if ( error ) {
          throw new Meteor.Error( 'mailgun-error', error );
        } else {
          console.log( response );
        }
      });
    } else {
      throw new Meteor.Error( 'bad-email', 'Sorry, you\'re not a registered user.' );
    }
  },
  'syncExistingUsersToMailgun': function() {
    var users = Meteor.users.find().fetch();
    for( var i = 0; i < users.length; i++ ) {
      if ( users[ i ].emails ) {
        var email = users[ i ].emails[ 0 ].address;
        list.members().create({
          subscribed: true,
          address: email
        }, function( error, response ) {
          if ( error ) {
            console.log( 'mailgun-error', error );
          } else {
            console.log( response );
          }
        });
      }
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