Template.newUser.onRendered(function () {

	var tour = {
		id: "onboarding",
		steps: [
			{
				title: "During the Game",
				content: "While watching you can guess what will happen next.",
				target: document.querySelector(".player-slider"),
				placement: "bottom",
				arrowOffset: "center",
			},
			{
				title: "Select A Play",
				content: "Depending on what happens in the game you get different options. You watch every game, so you know Joe will hit a double.<br><br><strong>Tap Double</strong>",
				target: document.querySelector(".double"),
				placement: "bottom",
				showNextButton: false
			},
			{
				title: "Multiplier",
				content: "Each option has a real time multiplier. They change depending on the player, opposing team, and pitcher.",
				target: document.querySelector(".double"),
				placement: "top",
				arrowOffset: "230"
			},
			{
				title: "Coins",
				content: "Once you have picked the play and the wager click submit. You must be quick! Options will disappear once the ball is snapped.",
				target: document.querySelector(".bar-header"),
				placement: "bottom",
				arrowOffset: "130"
			},
			{
				title: "Wager",
				content: "Select what wager you want for this play. <br><br><strong>Tap 500</strong>",
				target: document.querySelector(".double"),
				placement: "top",
				yOffset: "50",
				showNextButton: true,
				onNext: function() {
					$("#500").prop("checked", true)
					$("#submit-response").addClass('button-balanced');
				}
			},
			{
				title: "Submit!",
				content: "Once you have picked the play and the wager click submit. You must be quick! Options will disappear once the ball is snapped. <br><br><strong>Click Submit!</strong>",
				target: document.querySelector(".submit-response"),
				placement: "top",
				showNextButton: false
			}
		]
	};

	hopscotch.startTour(tour);
});
// Start the tour!

// Template.questionExample.events({
// 	'click .double': function (event, template) {
// 		var otherSelected = $('.wager') 
//     // If a play has been selected before than remove that 
//     if (otherSelected) {
//       // Remove old
//       $('.wager').remove();
//     } 
// 		$('input:radio[name=play]').prop( "checked", true )
//     var answer = $('input:radio[name=play]:checked').parent()
//     answer.after($("<div class='wager'></div>")) 
//     var selectedPlay = $('.wager')[0]
//     Blaze.render(Template.wagerExample, selectedPlay)
// 		hopscotch.nextStep()
// 	},
// 	'click .wager': function (event, template) {
//     var checked = $( "input:checked" )
//     if (checked.length === 2) {
//       // Checkout this sexy daisy chain ;)
//       var combined = parseInt(3.76*500)
//       $('#wager').checked
//       $("#submit-response").prop('value', 'Submit ( Potential Winnings: ' + combined + " )");
//       $(".submit-response").prop("disabled", false)
//       $(".submit-response").addClass('button-balanced');
//       return true 
//     }
// 		hopscotch.nextStep()
// 	},
// 	'click input:submit': function (event) {
// 		event.preventDefault();
// 		var newUser = !Meteor.user().profile.isOnboarded
// 		var userId = Meteor.user()._id
// 		Meteor.users.update(Meteor.userId(), {$set: {"profile.isOnboarded": true}});
//     analytics.track("newOnboarded", {
//       id: userId,
//       newUser: newUser
//     });
// 		hopscotch.endTour();
// 		Router.go("/");
// 	}
// });

Template.newUser.rendered = function() {
    console.log(this.data); // you should see your passage object in the console
};

Template.newUser.helpers({
	questions: function () {
		var questions = Questions.find({}).fetch()
		return questions
	}
});

