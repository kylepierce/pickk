Template.settings.helpers({
	username: function () {
		var currentUser = Meteor.user();
		if (currentUser.profile.username) {
			return currentUser.profile.username;
		} else if (currentUser.services && currentUser.twitter && currentUser.services.twitter.screenName) {
			return currentUser.services.twitter.screenName;
		} else {
			return "";
		}
	},


	firstName: function () {
		var currentUser = Meteor.user();
		if (currentUser.profile.firstName) {
			return currentUser.profile.firstName;
		} else if (currentUser.services && currentUser.services.facebook && currentUser.services.facebook.first_name) {
			return currentUser.services.facebook.first_name;
		} else {
			return "";
		}
	},


	lastName: function () {
		var currentUser = Meteor.user();
		if (currentUser.profile.lastName) {
			return currentUser.profile.lastName;
		} else if (currentUser.services && currentUser.services.facebook && currentUser.services.facebook.last_name) {
			return currentUser.services.facebook.last_name;
		} else {
			return "";
		}
	},
});

Template.settings.events({
	'click [name=username]':function(){
		$('#usernameReq').css('display', 'block')
	},

	'keyup [name=username]': function(event, template){
		event.preventDefault();
		var username = event.target.value;
		var uniqueUsername = UserList.findOne({"profile.username": username});
		var currentUser = Meteor.user()
		var currentUsername = currentUser.profile.username

		function hasWhiteSpace(s) {
      return /\s/g.test(s);
     }

		if(username.length < 3){
			// Check to make sure the username is longer than 3 characters
			template.$("[name=username]").css("color", "red");
			template.$("#short").css("color", "red");
			template.$("#long").css("color", "green");
		} 

		else if (username.length > 16) {
			// Check to see that the username is less than 16
			template.$("[name=username]").css("color", "red");
			template.$("#short").css("color", "green");
			template.$("#long").css("color", "red");
		}	

		else if (hasWhiteSpace(username)) {
			// Check for white space
			template.$("[name=username]").css("color", "red");
			template.$("#space").css("color", "red");
		} 

		else if(username == currentUsername) {
			// Show if that user already has that username
			template.$("[name=username]").css("color", "black");
			template.$("#short").css("color", "green");
			template.$("#long").css("color", "green");
			template.$("#space").css("color", "green");
		} 

		else if( uniqueUsername){
			// Check if the username is available 
			template.$("[name=username]").css("color", "red");
		}

		else{
			// If passes all those requirements then show green text.
			template.$("[name=username]").css("color", "green");
			template.$("#short").css("color", "green");
			template.$("#long").css("color", "green");
			template.$("#space").css("color", "green");
		}
	},

	'blur [name=username]': function(event, template){
		template.$('#usernameReq').hide()
	},


	'submit form': function (event) {
		event.preventDefault();
		var currentUserId = Meteor.userId();

		var username = event.target.username.value;
		var firstName = event.target.firstName.value;
		var lastName = event.target.lastName.value;
		// var avatar = $('#avatar').prop('src');

		var uniqueUsername = UserList.findOne({"profile.username": username});
		var currentUser = Meteor.user()
		var currentUsername = currentUser.profile.username

		function hasWhiteSpace(s) {
      return /\s/g.test(s);
    }

		if(username.length < 3){
				IonLoading.show({
        customTemplate: '<h3>Must be atleast 3 characters long.</h3>',
        duration: 1500,
        backdrop: true
      })
		}
		else if(username.length > 16){
				IonLoading.show({
        customTemplate: '<h3>Can not be longer than 15 characters</h3>',
        duration: 1500,
        backdrop: true
      })
		} 
		else if (hasWhiteSpace(username)) {
			IonLoading.show({
        customTemplate: '<h3>Can not have spaces in the username!</h3>',
        duration: 1500,
        backdrop: true
      })
		}
		else if( uniqueUsername && (currentUsername != username) ){
			IonLoading.show({
        customTemplate: '<h3>Someone already has that username! :(</h3>',
        duration: 1500,
        backdrop: true
      })
		} else{
			
			var newAccount = event.target.status.value;
			Meteor.call('updateProfile', currentUserId, username, firstName, lastName);
			if (newAccount == "Finish Profile"){
				Router.go('/onboarding');
			} else {
				Router.go('/');
			}
			
		}

		
	},

	"change input[name='avatar']": function(event, template) {
		var files = event.currentTarget.files;
		template.$(".loading").show();
		template.$(".avatar").hide();
		Cloudinary.upload(files, {
			folder: "avatars",
			transformation: [
				{width: 200, height: 200, gravity: "face", crop: "lfill"},
			],
			fields: {}
		}, function(error, result) {
			template.$(".loading").hide();
			template.$(".avatar").show();
			if (error) {
				throw error;
			}
			Meteor.users.update(Meteor.userId(), {$set: {"profile.avatar": result}});
			//console.log("Upload Error: ", error);
			//console.log("Upload Result: ", result);
		});
	}

});
