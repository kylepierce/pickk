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
}

