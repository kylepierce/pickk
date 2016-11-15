Template.landing.rendered = function() {
	var options = ["2b1d4d", "fed33e", "26ad68"]
	var existing = Session.get('ctaButton');
	if (!existing) {
		var min = Math.ceil(0);
	  var max = Math.floor(options.length);
	  var optionSelected = Math.floor(Math.random() * (max - min)) + min;
	  Session.set('ctaButton', options[optionSelected]);
	}

	var textOptions = ["Register", "Join", "Play Now", "Join!", "Play Now!", "Sign Up", "Sign Up!"]
	var existingText = Session.get('registerText');
	if (!existingText) {
		var min = Math.ceil(0);
	  var max = Math.floor(textOptions.length);
	  var optionSelected = Math.floor(Math.random() * (max - min)) + min;
	  Session.set('registerText', textOptions[optionSelected]);
	}

	var buttonColor = Session.get('ctaButton');
	var text = Session.get('registerText');
  analytics.page("/test-landing", {
    color: buttonColor,
    registerText: text
  });
};

Template.loginBox.helpers({
	ctaButton: function () {
		return Session.get('ctaButton');
	},
	registerText: function () {
		return Session.get('registerText');
	}
});

Template.loginBox.events({
	'click [data-action=register]': function () {
		var buttonColor = Session.get('ctaButton');
		var text = Session.get('registerText');
		var latest = Branch.initSession();
		console.log(latest)
    analytics.track("clicked register button", {
      color: buttonColor,
      registerText: text
    });

		Router.go('/register')
	},
	'click [data-action=login]': function () {
		Router.go('/login')
	},
});

Template.privacy.rendered = function() {
(function (w,d) {var loader = function () {var s = d.createElement("script"), tag = d.getElementsByTagName("script")[0]; s.src = "https://cdn.iubenda.com/iubenda.js"; tag.parentNode.insertBefore(s,tag);}; if(w.addEventListener){w.addEventListener("load", loader, false);}else if(w.attachEvent){w.attachEvent("onload", loader);}else{w.onload = loader;}})(window, document);
}
