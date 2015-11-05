// Template.findFriends.rendered = function () {
//     var ayudaContactos = []
//     if(Meteor.isCordova){
//       function onSuccess(contacts){
//         console.log(contacts);
//         contacts = _.sortBy(contacts, function(o) { return o.name.givenName; })
//         Session.set("contactos",contacts);
//       };
//       function onError(contactError){
//         Session.set("contactos","");
//       };
//       var options = new ContactFindOptions();
//       options.multiple = true;
//       var fields       = ["displayName", "name"];
//       var contactos = navigator.contacts.find(fields, onSuccess, onError, options);
//     }else{
//       Session.set("contactos", ayudaContactos);
//     }

    
// };


// Template.findFriends.helpers({
//   contactos: function () {
//     return Session.get("contactos");
//   },
//   tituloNav: "Invitar amigos"
// });