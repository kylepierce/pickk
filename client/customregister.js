if(Meteor.isClient){
	Template.register.events({
		'submit form': function(event, template){
			event.preventDefault();
			var firstName = template.find('#first-name').value;
			var lastName = template.find('#last-name').value;
			var username = template.find('#username').value;
			var emailVar = template.find('#email').value;
			var passwordVar = template.find('#password').value;
			Accounts.createUser({
				email: emailVar,
				password: passwordVar,
				username: username,
				firstName: firstName,
				lastName: lastName
			});
		}
	});
	Template.login.events({
		'submit form': function(event, template){
			event.preventDefault();
			var loginEmailVar = template.find('#login-email').value;
			var loginPasswordVar = template.find('#login-password').value;
			Meteor.loginWithPassword(loginEmailVar,loginPasswordVar);
		}
	});

	Template.twitter.events({
      'click [data-action=twitterLogin]' : function() {
        Meteor.loginWithTwitter();
      }
    });

    Template.facebook.events({
      'click [data-action=facebookLogin]' : function() {
        Meteor.loginWithFacebook();
      }
    });

  Meteor.startup(function () {
    AccountsEntry.config({
      // logo: '' ,                if set displays logo above sign-in options
      privacyUrl: '/privacy-policy',     // if set adds link to privacy policy and 'you agree to ...' on sign-up page
      termsUrl: '/terms-of-use',         // if set adds link to terms  'you agree to ...' on sign-up page
      homeRoute: '/'  ,                  // mandatory - path to redirect to after sign-out
      dashboardRoute: '/home'   ,   // mandatory - path to redirect to after successful sign-in
      profileRoute: 'profile',
      passwordSignupFields: 'EMAIL_ONLY',
      showSignupCode: false,
      showOtherLoginServices: true   ,   // Set to false to hide oauth login buttons on the signin/signup pages. Useful if you are using something like accounts-meld or want to oauth for api access
      extraSignUpFields: [{             // Add extra signup fields on the signup page
        field: "firstName",                           // The database property you want to store the data in
        name: " ",  // An initial value for the field, if you want one
        label: "First Name",                      // The html lable for the field
        placeholder: "John",                 // A placeholder for the field
        type: "text",                            // The type of field you want
        required: true                           // Adds html 5 required property if true
       },
       {           // Add extra signup fields on the signup page
        field: "lastName",                           // The database property you want to store the data in
        name: " ",  // An initial value for the field, if you want one
        label: "Last Name",                      // The html lable for the field
        placeholder: "Doe",                 // A placeholder for the field
        type: "text",                            // The type of field you want
        required: true                           // Adds html 5 required property if true
       },
       {             // Add extra signup fields on the signup page
        field: "username",                           // The database property you want to store the data in
        name: " ",  // An initial value for the field, if you want one
        label: "Username",                      // The html lable for the field
        placeholder: "JohnDoe123",                 // A placeholder for the field
        type: "text",                            // The type of field you want
        required: true                           // Adds html 5 required property if true
       }],
    });
  });


}

