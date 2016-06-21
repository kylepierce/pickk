Template.newUser.onRendered(function () {

	var tour = {
		id: "onboarding",
		steps: [
			{
				title: "During the Game",
				content: "While watching you can guess what will happen next.",
				target: document.querySelector(".question"),
				placement: "bottom",
				arrowOffset: "center",
			},
			{
				title: "Select A Play",
				content: "Depending on what happens in the game you get different options. <br><br><strong>Tap Interception</strong>",
				target: document.querySelector(".play"),
				placement: "bottom",
				showNextButton: false
			},
			{
				title: "Multiplier",
				content: "Each option has a multiplier. If its 3rd and short it will have different multipliers than 3rd and long.",
				target: document.querySelector("#multiplier"),
				placement: "bottom",
				xOffset: "-240",
				arrowOffset: "230"
			},
			{
				title: "Wager",
				content: "Know Jay Cutler is going to throw an interception? <br><br><strong>Wager big and select 1000!</strong>",
				target: document.querySelector("#bigBet"),
				placement: "top",
				showNextButton: false
			},
			{
				title: "Coins!",
				content: "Once you have picked the play and the wager click submit. You must be quick! Options will disappear once the ball is snapped.",
				target: document.querySelector(".coin-icon"),
				placement: "bottom",
				xOffset: "-200",
				arrowOffset: "230",
				onNext: function() {
					$("#submit-response").prop("disabled", false)
					$("#submit-response").addClass('button-balanced');
				}
			},
			{
				title: "Submit!",
				content: "Once you have picked the play and the wager click submit. You must be quick! Options will disappear once the ball is snapped. <br><br><strong>Click Submit!</strong>",
				target: document.querySelector("#submit-response"),
				placement: "top",
				showNextButton: false
			}
		]
	};

	hopscotch.startTour(tour);
});
// Start the tour!

Template.newUser.events({
	'click a': function () {
		hopscotch.endTour()
	},
	'click input:radio[name=play]': function () {

		hopscotch.nextStep()
	},
	'click input:radio[name=wager]': function () {
		hopscotch.nextStep()
	},
	'click input:submit': function (event) {
		event.preventDefault();
		hopscotch.endTour();
		Router.go("/");
	}
})
