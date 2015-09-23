
// Display active cards
Meteor.subscribe('userAnswer');
Meteor.subscribe('activeQuestions');


// Template.home.onCreated( function() {

//   this.subscribe( 'activeQuestions', function() {
//     $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function() {
//       $( ".loading-wrapper" ).fadeIn( 'slow' );
//     });
//   });
// });

Template.home.onRendered( function() {
//   $( "svg" ).delay( 750 ).fadeIn();	

var tour = { 
      id: "onboarding",
      steps: [
        {
          title: "Play",
          content: "While watching you can guess what will happen next.",
          target: document.querySelector(".question"),
          placement: "bottom",
          arrowOffset: "center"
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
          placement: "left",
          xOffset: "30",
          yOffset: "-20"
        },
        {
          title: "Wager",
          content: "Know Jay Cutler is going to throw an interception? <br><br><strong>Wager big and select 1000!</strong>",
          target: document.querySelector("#bigBet"),
          placement: "top",
          showNextButton: false
        },
        {
          title: "Submit!",
          content: "Once you have picked the play and the wager click submit. You must be quick! Options will disappear once the ball is snapped. <br><br><strong>Click Submit!</strong>",
          target: document.querySelector("#submit-response"),
          placement: "top",
          multipage: true,
          onNext: function() {
            window.location = "dashboard"
          },
          showNextButton: false,
        },
        {
          title: "Coins!",
          content: "You predicted that interception! You won 3710 coins. (3.71 x 1000) ",
          target: document.querySelector(".coin-icon"),
          placement: "bottom",
          xOffset: "-250",
          arrowOffset: "230"
        },
        {
          title: "Menu",
          content: "Menu to see groups, settings, or leave app feedback.",
          target: document.querySelector(".nav-icon"),
          placement: "bottom"
        }
      ]
};


  if (hopscotch.getState() === "onboarding:5") {
     hopscotch.startTour(tour);
  }
});

// this should be changed to startup. There might also be some additions for user types
Template.home.rendered = function (template) {
  if (!Meteor.loggingIn() && !Meteor.user()) {
   	 Router.go('/landing');
  }   
};

Template.home.helpers({
	gameName: function () {
		return Games.findOne({live: true});
	}
});


Template.activeQuestion.animations({
  ".container-item": {
    container: ".container", // container of the ".item" elements
    insert: {
      class: "animated fast slideInLeft", // class applied to inserted elements
      before: function(attrs, element, template) {}, // callback before the insert animation is triggered
      after: function(attrs, element, template) {}, // callback after an element gets inserted
      delay: 100 // Delay before inserted items animate
    },
    animateInitial: true, // animate the elements already rendered
    animateInitialStep: 200, // Step between animations for each initial item
    animateInitialDelay: 500 // Delay before the initial items animate
  }
});

Template.questionCard.helpers({
	'live': function(){
		Meteor.subscribe('games')
		var game = Games.findOne({live: true});
		if(game == undefined){
			return true
		} else {
			return false
		}
	},
	'active': function(){
		var currentUser = Meteor.userId();
		var active = QuestionList.find(
				{active: true, 
				usersAnswered: {$nin: [currentUser]}}, 
				{sort: {dateCreated: 1,}}).fetch();
		if(active.length >= 1){
			return true
		} else {
			return false
		}
		console.log(active)
	},
	'commercial': function(game){
		Meteor.subscribe('games')
		var game = Games.findOne({live: true});

		if(game.commercial == true){
				return true
		} else {
			return false
		}
	}
});

Template.activeQuestion.helpers({
		'questions': function(){
		var currentUser = Meteor.userId();

		return QuestionList.find(
				{active: true, 
				usersAnswered: {$nin: [currentUser]}}, 
				{sort: {dateCreated: 1,}});
	}
});

Template.questionCard.events({
	'click input:radio[name=wager]':function(event, template) {
		var wager = template.find('input:radio[name=wager]:checked').value

		$("#submit-response").prop("disabled", false)
		$("#submit-response").addClass('button-balanced');
	},

	// 'click input:radio[name=play]':function(event, template) {
	// 	play = template.find('input:radio[name=play]:checked').value
	// },

	'submit form': function(event, template) {
		event.preventDefault();
		var questionId = this._id; 
		var currentUser = Meteor.userId();
		var answer = template.find('input:radio[name=play]:checked').value;
		var wager = template.find('input:radio[name=wager]:checked').value;

		var userCoins = Meteor.user().profile.coins;
		if (userCoins < wager) {
			IonLoading.show({
      	customTemplate: '<h3>Not enough coins :(</h3><p>Lower the amount or purchase extra coins in our store</p>',
      	duration: 1500,
      	backdrop: true
    	});
		} else {
		$( ".container-item" ).removeClass( "slideInLeft" )
		$( ".container-item" ).addClass( "slideOutRight" )

    // var countdown = new ReactiveCountdown(300);
    // countdown.start(function(){
    //   console.log("Done")
    //   Meteor.call('playerInactive', currentUser, questionId);
    // })

    setTimeout(function(){
			Meteor.call('questionAnswered', currentUser, questionId, answer, wager);
    }, 250);

    }
	}
});