// Template.landing.events({
//   'submit form': function(event, template) {
//     var	email = event.target.emailAddress.value;
// 		var requested = (new Date()).getTime();

// 		var invitee = {
// 			email: email,
// 			invited: false,
// 			requested: requested
// 		}

// 		Meteor.call('addToInvitesList', invitee, function(error, response) {
// 		  if (error) {
// 		  	IonLoading.show({
//         customTemplate: error.reason,
//         duration: 1500,
//         backdrop: true
//       });
// 		  } else {
//         IonLoading.show({
//         customTemplate: 'You have been added to the waitlist. ',
//         duration: 1500,
//         backdrop: true
//       });
//         $('#email-capture').remove()
//         $('#thanks-message').html("<div class='thanks-message balanced'> You have been added to the waitlist.</div>")
// 		  }
// 		});
// 		return event.preventDefault();
//   }
// });

// Template.landing.rendered = function() {
//   return $('#request-beta-invite').validate({
//     rules: {
//       emailAddress: {
//         email: true,
//         required: true
//       }
//     },
//     messages: {
//       emailAddress: {
//         email: "Please use a valid email address.",
//         required: "An email address is required to get your invite."
//       }
//     },
//     submitHandler: function() {}
//   });
// };

Template.privacy.rendered = function() {
(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src = "https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);
}
