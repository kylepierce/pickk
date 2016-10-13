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
				content: "Depending on what happens in the game you get different options. You watch every game, so you know The Jet will hit a home run to win.<br><br><strong>Tap Home Run</strong>",
				target: document.querySelector("#double"),
				placement: "bottom",
				showNextButton: false
			},
			{
				title: "Multiplier",
				content: "Each option has a real time multiplier. Multiplier will change depending on the player, opposing team, and pitcher.",
				target: document.querySelector("#double"),
				placement: "top",
				arrowOffset: "230"
			},
			{
				title: "Coins",
				content: "Once you have picked the play and a wager click submit. You have be quick! Options will disappear once the ball thrown.",
				target: document.querySelector(".bar-header"),
				placement: "bottom",
				arrowOffset: "130"
			},
			{
				title: "Wager",
				content: "Select what wager you want for this play. <br><br><strong>Tap 500</strong>",
				target: document.querySelector("#double"),
				placement: "top",
				yOffset: "50",
			},
			{
				title: "Submit!",
				content: "Once you have picked the play and the wager click submit.<br><br><strong>Click Submit!</strong>",
				target: document.querySelector("#triple"),
				placement: "top",
				yOffset: "-60",
			}
		]
	};

	hopscotch.startTour(tour);
});
// Start the tour!

Template.exampleOptions.events({
	'click #double': function (e, t) {
		var $selected = $(e.currentTarget)
		$selected.addClass('play-selected ten-spacing')
    var container = $('#wagers')[0]
    Blaze.render(Template.exampleWagers, container)
    hopscotch.nextStep()
	}
});

Template.exampleWagers.events({
	'click #500': function (e, t) {
		var $selected = $(e.currentTarget)
		$selected.addClass('wager-selected')
		var container = $('#submit-button')[0]
    Blaze.render(Template.exampleSubmit, container)
    hopscotch.nextStep()
	}
});

Template.exampleSubmit.events({
	'click #exampleSubmit': function(){
		hopscotch.endTour();
		Router.go("/");
	}
});

Template.newUser.helpers({
	questions: function () {
		var questions = Questions.find({}).fetch()
		return questions
	}
});

