var settings = Meteor.settings.private.mailgunApi
var mg = new Mailgun( { apiKey: settings.apiKey, domain: settings.domain } )
var domain = settings.domain
var listAddress = "hi@" + domain
var list = mg.api.lists( listAddress );


Meteor.methods({
  'addToMailingList': function( emailAddress ) {
    check( emailAddress, String );
    var user = UserList.find({"emails.address": emailAddress}).fetch()
    var userExist = list.members(emailAddress)
    if(!userExist){
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