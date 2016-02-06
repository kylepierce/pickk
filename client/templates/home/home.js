
// Display active cards


// Template.home.onCreated( function() {

//   this.subscribe( 'activeQuestions', function() {
//     $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function() {
//       $( ".loading-wrapper" ).fadeIn( 'slow' );
//     });
//   });
// });

Meteor.startup(function () {
  if (Meteor.isCordova) {
    if (AdMob) {
      AdMob.createBanner( {
        adId: 'ca-app-pub-4862520546869067/2500441433',
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        isTesting: false,
        autoShow: true,
        success: function() {
          console.log("Received ad");
        },
        error: function() {
          console.log("No ad received");
        }
      });
    } 
  }
});

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
  var username = Meteor.user().profile.username
  if(username === "" || username === null || username === "undefined"){
    Router.go('/newUserSettings')
  }
};

Template.home.helpers({
	game: function () {
		return Games.findOne({live: true});
	},
  scoreMessage: function () {
    var userData = Meteor.user()
    var notifications = userData.pendingNotifications

    notifications.forEach(function (post) {
      var id = post._id
      var message = post.message  
      if(post.type === "score" && post.read === false ){
        Meteor.call('readNotification', id);
         
        sAlert.info(message  , {effect: 'stackslide', html: true});

      } else if(post.type === "diamonds" && post.tag == null && post.read === false ){
        message = '<img style="height: 40px;" src="/diamonds.png"> <p class="diamond"> ' + message + '</p>'        
        Meteor.call('readNotification', id);
         
        sAlert.warning(message, {effect: 'stackslide', html: true});

      } else if(post.tag == "leader"){
        IonPopup.show({
          title: 'Leaderboard Winnings!',
          template: message,
          buttons: [{
            text: 'Got It!',
            type: 'button-positive',
            onTap: function() {
              Meteor.call('readNotification', id);
              $('body').removeClass('popup-open');
              $('.backdrop').remove();
              Blaze.remove(this.view);
            }
          }]
        });
      } else if(post.tag == "exchange"){
        message = '<img style="max-width:100%;" src="/storeowner.png">' + message 
        IonPopup.show({
          title: 'Diamond Exchange',
          template: message,
          buttons: [{
            text: 'Got It!',
            type: 'button-positive',
            onTap: function() {
              Meteor.call('readNotification', id);
              $('body').removeClass('popup-open');
              $('.backdrop').remove();
              Blaze.remove(this.view);
            }
          }]
        });
      }
    });
  }
});


Template.activeQuestion.animations({
  ".container-item": {
    container: ".container", // container of the ".item" elements
    insert: {
      class: "animated fast slideInLeft", // class applied to inserted elements
      before: function(attrs, element, template) {
        $( "#normalCard" ).css("display", "")
      }, // callback before the insert animation is triggered
      after: function(attrs, element, template) {}, // callback after an element gets inserted
      delay: 200 // Delay before inserted items animate
    },
    animateInitial: true, // animate the elements already rendered
    animateInitialStep: 200, // Step between animations for each initial item
    animateInitialDelay: 500 // Delay before the initial items animate
  }
});

Template.twoOptionQuestions.animations({
  ".container-item": {
    container: ".container", // container of the ".item" elements
    insert: {
      class: "animated fast slideInLeft", // class applied to inserted elements
      before: function(attrs, element, template) {
        $( "#normalCard" ).css("display", "")
      }, // callback before the insert animation is triggered
      after: function(attrs, element, template) {}, // callback after an element gets inserted
      delay: 200 // Delay before inserted items animate
    },
    animateInitial: true, // animate the elements already rendered
    animateInitialStep: 200, // Step between animations for each initial item
    animateInitialDelay: 500 // Delay before the initial items animate
  }
});

Template.commercialQuestion.animations({
  ".container-item": {
    container: ".container", // container of the ".item" elements
    insert: {
      class: "animated fast slideInLeft", // class applied to inserted elements
      before: function(attrs, element, template) {
        $( "#commercialCard" ).css("display", "")
      }, // callback before the insert animation is triggered
      after: function(attrs, element, template) {}, // callback after an element gets inserted
      delay: 200 // Delay before inserted items animate
    },
    animateInitial: true, // animate the elements already rendered
    animateInitialStep: 200, // Step between animations for each initial item
    animateInitialDelay: 500 // Delay before the initial items animate
  }
});

Template.predictionQuestions.animations({
  ".container-item": {
    container: ".container", // container of the ".item" elements
    insert: {
      class: "animated fast slideInLeft", // class applied to inserted elements
      before: function(attrs, element, template) {
        $( "#gameCard" ).css("display", "")
      }, // callback before the insert animation is triggered
      after: function(attrs, element, template) {}, // callback after an element gets inserted
      delay: 200 // Delay before inserted items animate
    },
    animateInitial: true, // animate the elements already rendered
    animateInitialStep: 200, // Step between animations for each initial item
    animateInitialDelay: 500 // Delay before the initial items animate
  }
});


Template.binaryChoice.animations({
  ".container-item": {
    container: ".container", // container of the ".item" elements
    insert: {
      class: "animated fast slideInLeft", // class applied to inserted elements
      before: function(attrs, element, template) {
        $( "#binaryCard" ).css("display", "")
      }, // callback before the insert animation is triggered
      after: function(attrs, element, template) {
        
      }, // callback after an element gets inserted
      delay: 200 // Delay before inserted items animate
    },
    animateInitial: true, // animate the elements already rendered
    animateInitialStep: 200, // Step between animations for each initial item
    animateInitialDelay: 500 // Delay before the initial items animate
  }
});

Template.questionCard.helpers({
	'notLive': function(){
		var game = Games.findOne({live: true});
		if(game == undefined){
			return true
		} 
	},

  'live': function(){
    var game = Games.findOne({live: true});
    if(game.live == true){
      return true
    } 
  },
  gameQuestion: function(){
    var currentUser = Meteor.userId();
    var active = QuestionList.find(
        {active: true, commercial: null,
        usersAnswered: {$nin: [currentUser]}}, 
        {sort: {dateCreated: 1}}).fetch();
    if(active.length >= 1){
      return true
    } else {
      return false
    }
  },

  'gameQuestions': function(){
    var currentUser = Meteor.userId();

    return QuestionList.find(
        {active: true, gameId: "prediction",
        usersAnswered: {$nin: [currentUser]}}, 
        {sort: {dateCreated: 1}, limit: 1});
  },

  'lastPlay': function(){
    // Get the last question id 
    var questionId = Session.get('lastId')

    // Find the users answer and wager
    var currentUser = Meteor.user();

    // Find questionId in user answered 
    var userAnsweredArray = currentUser.questionAnswered

    // Search function to find the question in the array
    function search(nameKey, myArray){
      for (var i=0; i < myArray.length; i++) {
        if (myArray[i].questionId === nameKey) {
            return myArray[i];
        }
      }
    }

    return search(questionId, userAnsweredArray)
  },

  'activeCheck': function(){
    questionId = Session.get('lastId');
    var question = QuestionList.findOne({_id: questionId});
    if(question.active === true){
      return true
    }
  },
  'connection': function(){
    var connection = Meteor.status()
    var status = connection.status
    console.log(status)
    if(status == "connected"){
      return true
    } else {
      return false
    }
  },

  'active': function(game){
    var game = Games.findOne({live: true});
    if(game.commercial == false){
        console.log("I work!")
        return true
    } else {
      return false
    }
  },

  'multiOptions': function(){
    var currentUser = Meteor.userId();
    var active = QuestionList.find(
        {active: true, commercial: false,
        usersAnswered: {$nin: [currentUser]}}, 
        {sort: {dateCreated: 1}}).fetch();
    if(active.length >= 1){
      console.log("There are some questions")
      return true
    } 
  },

  'ingameBinary': function(){
    var currentUser = Meteor.userId();
    var active = QuestionList.find(
        {active: true, commercial: false, binaryChoice: true,
        usersAnswered: {$nin: [currentUser]}}, 
        {sort: {dateCreated: 1}}).fetch();
    console.log(active)
    if(active.length >= 1){
      var first = active[0]
      return first
    } else {
      return false
    }
  },

  'commercialQuestions': function(){
    
    var currentUser = Meteor.userId();
    var active = QuestionList.find(
        {active: true, commercial: true,
        usersAnswered: {$nin: [currentUser]}}, 
        {sort: {dateCreated: 1}}).fetch();
    if(active.length >= 1){
      return true
    } else {
      return false
    }
  },
  'binary': function(){
    var currentUser = Meteor.userId();
    var active = QuestionList.find(
        {active: true, commercial: true, binaryChoice: true,
        usersAnswered: {$nin: [currentUser]}}, 
        {sort: {dateCreated: 1}}).fetch();
    console.log(active)
    if(active.length >= 1){
      var first = active[0]
      return first
    } else {
      return false
    }
  },

  'questions': function(){
    var currentUser = Meteor.userId();

    return QuestionList.find(
        {active: true, commercial: true, binaryChoice: true,
        usersAnswered: {$nin: [currentUser]}}, 
        {sort: {dateCreated: 1}, limit: 1});
  },

  'activeQuestions': function(){
    var currentUser = Meteor.userId();
    return QuestionList.find(
        {active: true, commercial: false,
        usersAnswered: {$nin: [currentUser]}}, 
        {sort: {dateCreated: 1}, limit: 1});
  },

  'twoOption': function(){
    var currentUser = Meteor.userId();
    return QuestionList.find(
        {active: true, commercial: false, binaryChoice: true,
        usersAnswered: {$nin: [currentUser]}}, 
        {sort: {dateCreated: 1}, limit: 1});
  },

  'multiAnswerCommQuestions': function(){
    var currentUser = Meteor.userId();

    return QuestionList.find(
        {active: true, commercial: true,
        usersAnswered: {$nin: [currentUser]}}, 
        {sort: {dateCreated: 1}, limit: 1});
  },

	'commercial': function(game){
		var game = Games.findOne({live: true});
		if(game.commercial == true){
				return true
		}
	},
  'commercialRandom': function(){
    var random = Math.floor((Math.random() * 6) + 1)
    if (random == 1){
      return '<p class="did-you next-play">Join the Conversation by Tapping <br> the <i class="ion-ios-chatboxes"></i> Button</p>'
    } else if (random == 2) {
      return '<p class="did-you next-play">Playing With Friends? Create a Group!</p>'
    } else if (random == 3) {
      return '<p class="did-you next-play">Follow @GetPickk on Twitter, Instagram and Facebook</p>'
    } else if (random == 4) {
      return '<p class="did-you next-play"><b>Have a question?</b><br> Check out our common questions in our side menu</p>'
    } else if (random == 5) {
      return '<p class="did-you next-play"><b>What do diamonds do?</b><br> Diamonds are how we track who performed the best in a week. Once the week is over the diamond leaders are given prizes.</p>'
    } else if (random == 6) {
      return '<p class="did-you next-play"><b>What do Coins do?</b><br> Coins are how we track who performed the best in a game. Once the game is over the coins are exchanged into diamonds.</p>'
    } 

  }
});

Template.activeQuestion.helpers({
  'live': function(){
    var connection = Meteor.status()
    var status = connection.status
    console.log(status)
    if(status == "connected"){
      return true
    } else {
      return false
    }
  }
});

Template.commercialQuestion.helpers({
  'showAds': function(event, template){

    Meteor.defer(function () {
    AdMob.prepareInterstitial({
      adId:'ca-app-pub-4862520546869067/3340412630', 
      autoShow:true,
      success: function() {
        console.log("Received ad");
      },
      error: function() {
        console.log("No ad received");
      }
    });
    return AdMob.showInterstitial()
  });
    return "";
  },
  'showAdsRandom': function(event, template){
    var random = Math.floor((Math.random() * 2) + 1)
    if (random == 1){
      Meteor.defer(function () {
      AdMob.prepareInterstitial({
        adId:'ca-app-pub-4862520546869067/3340412630', 
        autoShow:true,
        success: function() {
          console.log("Received ad");
        },
        error: function() {
          console.log("No ad received");
        }
      });
      return AdMob.showInterstitial()
    });
  }
    return "";
  },
  'live': function(){
    var connection = Meteor.status()
    var status = connection.status
    console.log(status)
    if(status == "connected"){
      return true
    } else {
      return false
    }
  }
});

Template.predictionQuestions.helpers({
    'questions': function(){
    var currentUser = Meteor.userId();

    return QuestionList.find(
        {active: true, commercial: null, 
        usersAnswered: {$nin: [currentUser]}}, 
        {sort: {dateCreated: 1}, limit: 1});
  },
  'live': function(){
    var connection = Meteor.status()
    var status = connection.status
    console.log(status)
    if(status == "connected"){
      return true
    } else {
      return false
    }
  }
});

Template.predictionQuestions.events({
  'click input:radio[name=score]':function(event, template) {
    $("#submit-response").prop("disabled", false)
    $("#submit-response").addClass('button-balanced');
  },

  'submit form': function(event, template) {
    event.preventDefault();
    var questionId = this._id; 
    var currentUser = Meteor.userId();
    var que = this.que;
    var answer = template.find('input:radio[name=score]:checked').value;

    // Move the card off screen
    $( ".container-item" ).removeClass( "slideInLeft" )
    $( ".container-item" ).addClass( "slideOutRight" )

    // Wait until the question card has disapeared
    Meteor.setTimeout(function(){
       Meteor.call('gameQuestionAnswered', currentUser, questionId, answer);

    }, 500);
  }
});

Template.binaryChoice.events({
  'click input:radio[name=binary]':function(event, template) {
    $("#submit-binary").prop("disabled", false)
    $("#submit-binary").addClass('button-balanced');
  },

  'click #submit-binary': function(event, template){
    var answer = template.find('input:radio[name=binary]:checked').value;
    var currentUser = Meteor.userId();
    var questionId = this._id;
    var que = this.que 

    // Move the card off screen
    $( ".container-item" ).removeClass( "slideInLeft" )
    $( ".container-item" ).addClass( "slideOutRight" )

    // Wait until the question card has disapeared
    Meteor.setTimeout(function(){
      Meteor.call('binaryQuestionAnswered', currentUser, questionId, answer, que)
    }, 250);
  },
});

Template.binaryChoice.helpers({
  'live': function(){
    var connection = Meteor.status()
    var status = connection.status
    console.log(status)
    if(status == "connected"){
      return true
    } else {
      return false
    }
  }
});

Template.twoOptionQuestions.events({
  'click input:radio[name=binary]':function(event, template) {
    $("#submit-binary").prop("disabled", false)
    $("#submit-binary").addClass('button-balanced');
    $("input:radio[name=binary]").addClass('border');
  },

  'click #submit-response': function(event, template){
    var answer = template.find('input:radio[name=binary]:checked').value;
    var currentUser = Meteor.userId();
    var questionId = this._id;
    var que = this.que 
    var wager = template.find('input:radio[name=wager]:checked').value;

    // Move the card off screen
    $( ".container-item" ).removeClass( "slideInLeft" )
    $( ".container-item" ).addClass( "slideOutRight" )

    console.log(que + " " + answer + " " + wager)
    // Wait until the question card has disapeared
    Meteor.setTimeout(function(){
      Meteor.call('twoOptionQuestionAnswered', currentUser, questionId, answer, wager, que)
    }, 250);
  },
});

Template.twoOptionQuestions.helpers({
  'live': function(){
    var connection = Meteor.status()
    var status = connection.status
    console.log(status)
    if(status == "connected"){
      return true
    } else {
      return false
    }
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

  'click #changeAnswer': function(){
    var questionId = Session.get('lastId');
    var answer = Session.get('lastAnswer');
    var wager = Session.get('lastWager');
    var currentUser = Meteor.userId();

    Meteor.call('questionUnanswered', currentUser, questionId, answer, wager);

  },

	'submit form': function(event, template) {
		event.preventDefault();
		var questionId = this._id; 
		var currentUser = Meteor.userId();
		var que = this.que;
    var answer = template.find('input:radio[name=play]:checked').value;
		var wager = template.find('input:radio[name=wager]:checked').value;
    var description = template.find('input:radio[name=play]:checked').id;
		var userCoins = Meteor.user().profile.coins;

		if (userCoins < wager) {
			IonLoading.show({
      	customTemplate: '<h3>Not enough coins :(</h3><p>Lower the amount or or wait until the commercial for free pickks!</p>',
      	duration: 1500,
      	backdrop: true
    	});
		} else {
		$( ".container-item" ).removeClass( "slideInLeft" )
		$( ".container-item" ).addClass( "slideOutRight" )

    Session.set('lastId', questionId);
    Session.set('lastAnswer', answer);
    Session.set('lastWager', wager);

    analytics.track("userAnsweredQuestion", {
      id: currentUser,
      question: que,
      questionId: questionId,
      answer: answer,
      wager: wager,
      description: description
    });

    var countdown = new ReactiveCountdown(360);
    countdown.start(function(){ 
      Meteor.call('playerInactive', currentUser, questionId);
    })

    setTimeout(function(){
			Meteor.call('questionAnswered', currentUser, questionId, answer, wager, description);
    }, 250);

    }
	}
});