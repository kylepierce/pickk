// Template.home.onCreated( function() {

//   this.subscribe( 'activeQuestions', function() {
//     $( ".loader" ).delay( 1000 ).fadeOut( 'slow', function() {
//       $( ".loading-wrapper" ).fadeIn( 'slow' );
//     });
//   });
// }); 

// Template.home.onRendered( function() {
//   $( "svg" ).delay( 750 ).fadeIn();	

// this should be changed to startup. There might also be some additions for user types
Template.home.rendered = function (template) {
  if (!Meteor.loggingIn() && !Meteor.user()) {
   	 Router.go('/landing');
  }

  if (Meteor.user()) {
    var username = Meteor.user().profile.username;
    if (username === "" || username === null || username === "undefined") {
      Router.go('/newUserSettings')
    }
  }
};

Template.home.helpers({
	game: function () {
		return Games.findOne({live: true});
	},
  scoreMessage: function () {
    var user = Meteor.user();
    var notifications = user && user.pendingNotifications || [];

    notifications.forEach(function (post) {
      var id = post._id
      var message = post.message  
      var shareMessage = "+!Meow " + post.shareMessage
      var sharable = post.sharable
      Session.set("shareMessage", shareMessage);
      if(post.type === "score" && post.read === false ){
        Meteor.call('readNotification', id);
        if(sharable == true){
          var message = '<div style="width: 60%; float: left;">' + message + '</div><button data-action="shareResult" class="button button-balanced">Share</button>'  

          sAlert.info(message , {effect: 'stackslide', html: true});
        } else {
          sAlert.info(message , {effect: 'stackslide', html: true});
        }
        

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

Template.sAlert.events({
  'click [data-action="shareResult"]': function () {
    var message = Session.get("shareMessage");
    var groupId = Session.get('chatGroup')
    var currentUser = Meteor.userId();
    sAlert.closeAll();
    IonLoading.show({
      customTemplate: '<h3>Shared in Chat!</h3>',
      duration: 1500,
      backdrop: true
    })
    Meteor.call('addChatMessage', currentUser, message, groupId);
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
    if(game && game.live == true){
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
    if(status == "connected"){
      return true
    } else {
      return false
    }
  },

  'active': function(game){
    var game = Games.findOne({live: true});
    if(game.commercial == false){
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
      return true
    } 
  },

  'ingameBinary': function(){
    var currentUser = Meteor.userId();
    var active = QuestionList.find(
        {active: true, commercial: false, binaryChoice: true,
        usersAnswered: {$nin: [currentUser]}}, 
        {sort: {dateCreated: 1}}).fetch();
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

Template.submitButton.rendered = function() {
  if(!this._rendered) {
    this._rendered = true;
    var checked = $( "input:checked" )
    if (checked.length === 2) {
      // Checkout this sexy daisy chain ;)
      var answer = $('input:radio[name=play]:checked').siblings().children()[2].id
      answer = parseFloat(answer)
      var wager = $('input:radio[name=wager]:checked').val();
      var combined = parseInt(answer*wager)
      $('#wager').checked
      $("#submit-response").prop('value', 'Submit ( Potential Winnings: ' + combined + " )");
      $("#submit-response").prop("disabled", false)
      $("#submit-response").addClass('button-balanced');
      return true 
    }

  }
}

Template.submitButton.helpers({
  'live': function(){
    var connection = Meteor.status()
    var status = connection.status

    if(status == "connected"){
      return true
    } else {
      return false
    }
  }
});

Template.binarySubmitButton.rendered = function() {
  if(!this._rendered) {
    this._rendered = true;
    var checked = $( "input:checked" )
    if (checked.length === 2) {
      // Checkout this sexy daisy chain ;)
      var answer = $('input:radio[name=binary]:checked').siblings().children()[2].id
      answer = parseFloat(answer)
      var wager = $('input:radio[name=wager]:checked').val();
      var combined = parseInt(answer*wager)
      $('#wager').checked
      $("#submit-response").prop('value', 'Submit ( Potential Winnings: ' + combined + " )");
      $("#submit-response").prop("disabled", false)
      $("#submit-response").addClass('button-balanced');
      return true 
    }

  }
}

Template.binarySubmitButton.helpers({
  'live': function(){
    var connection = Meteor.status()
    var status = connection.status

    if(status == "connected"){
      return true
    } else {
      return false
    }
  }
});

Template.activeQuestion.events({
  'click [name=play]': function( event, template ){
    var otherSelected = $('.wager') 
    // If a play has been selected before than remove that 
    if (otherSelected) {
      // Remove old
      $('.wager').remove();
    } 
    // Otherwise add the wager and submit button after
    var answer = $('input:radio[name=play]:checked').parent()
    answer.after($("<div class='wager'></div>")) 
    var selectedPlay = $('.wager')[0]
    Blaze.render(Template.submitAndWagers, selectedPlay)
  },
  'click input': function (event, template) {
    var checked = $( "input:checked" )
    if (checked.length === 2) {
      // Checkout this sexy daisy chain ;)
      var answer = $('input:radio[name=play]:checked').siblings().children()[2].id
      var wager = template.find('input:radio[name=wager]:checked').value;
      var combined = parseInt(answer*wager)
      $('#wager').checked
      $("#submit-response").prop('value', 'Submit ( Potential Winnings: ' + combined + " )");
      $("#submit-response").prop("disabled", false)
      $("#submit-response").addClass('button-balanced');
      return true 
    }
  }
});

Template.commercialQuestion.events({
  'click [name=play]': function( event, template ){
    var otherSelected = $('.wager') 
    // If a play has been selected before than remove that 
    if (otherSelected) {
      // Remove old
      $('.wager').remove();
    } 
    // Otherwise add the wager and submit button after
    var answer = $('input:radio[name=play]:checked').parent()
    answer.after($("<div class='wager'></div>")) 
    var selectedPlay = $('.wager')[0]
    Blaze.render(Template.submitAndWagers, selectedPlay)
  },
  'click input': function (event, template) {
    var checked = $( "input:checked" )
    if (checked.length === 2) {
      // Checkout this sexy daisy chain ;)
      var answer = $('input:radio[name=play]:checked').siblings().children()[1].id
      var wager = template.find('input:radio[name=wager]:checked').value;
      var combined = parseInt(answer*wager)
      $('#wager').checked
      $("#submit-response").prop('value', 'Submit ( Potential Winnings: ' + combined + " )");
      $("#submit-response").prop("disabled", false)
      $("#submit-response").addClass('button-balanced');
      return true 
    }
  }
});

Template.commercialQuestion.helpers({
  'live': function(){
    var connection = Meteor.status()
    var status = connection.status
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
    if(status == "connected"){
      return true
    } else {
      return false
    }
  }
});

Template.twoOptionQuestions.events({
  'click [name=binary]': function( event, template ){
    var otherSelected = $('.wager') 
    // If a play has been selected before than remove that 
    if (otherSelected) {
      // Remove old
      $('.wager').remove();
    } 
    // Otherwise add the wager and submit button after
    var answer = $('#two-choice')
    answer.after($("<div class='wager'></div>")) 
    var selectedPlay = $('.wager')[0]
    Blaze.render(Template.binarySubmitAndWagers, selectedPlay)
  },

  'click input': function (event, template) {
    var checked = $( "input:checked" )
    if (checked.length === 2) {
      // Checkout this sexy daisy chain ;)
      var answer = $('input:radio[name=binary]:checked').siblings().children()[0].id
      var wager = template.find('input:radio[name=wager]:checked').value;
      var combined = parseInt(answer*wager)
      $('#wager').checked
      $("#submit-binary").prop('value', 'Submit ( Potential Winnings: ' + combined + " )");
      $("#submit-binary").prop("disabled", false)
      $("#submit-binary").addClass('button-balanced');
      return true 
    }
  },


  'click #submit-binary': function(event, template){
    var answer = template.find('input:radio[name=binary]:checked').value;
    var currentUser = Meteor.userId();
    var questionId = template.data._id;
    var que = template.data.que 
    var wager = template.find('input:radio[name=wager]:checked').value;

    // Move the card off screen
    $( ".container-item" ).removeClass( "slideInLeft" )
    $( ".container-item" ).addClass( "slideOutRight" )

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

		// $("#submit-response").prop("disabled", false)
		// $("#submit-response").addClass('button-balanced');
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

    // analytics.track("userAnsweredQuestion", {
    //   id: currentUser,
    //   question: que,
    //   questionId: questionId,
    //   answer: answer,
    //   wager: wager,
    //   description: description
    // });

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

Template.wagers.rendered = function() {
  if(!this._rendered) {
    this._rendered = true;
    var previousWager = Session.get("lastWager");
    document.getElementById(previousWager).checked = true
  }
}

Template.wagers.events({
  'click input[name=wager]': function(event, template){
    var wager = this
  }
});

Template.gameBar.helpers({
  strikes: function() {
    var currentAtBat = AtBat.findOne({active: true});
    return currentAtBat.strikeCount
  },
  balls: function() {
    var currentAtBat = AtBat.findOne({active: true});
    return currentAtBat.ballCount
  },
  // outs: function ( ) {
  //   var currentGame = Games.findOne({live: true});
  //   return currentGame.outs
  // },
  first: function () {
    var currentGame = Games.findOne({live: true});
    //  
    var first = currentGame.playersOnBase.first
    if(first){
      return true
    } else {
      return false
    }
  },
  second: function () {
    var currentGame = Games.findOne({live: true});
    // 
    var second = currentGame.playersOnBase.second
    if(second){
      return true
    } else {
      return false
    }
  },
  third: function () {
    var currentGame = Games.findOne({live: true});
    // 
    var third = currentGame.playersOnBase.third
    if(third){
      return true
    } else {
      return false
    }
  },
  inning: function ( ) {
    var currentGame = Games.findOne({live: true});
    return currentGame.inning
  },
  oneOut: function(){
    var currentGame = Games.findOne({live: true});
    var outs = currentGame.outs
    if ( outs >= 1 ) {
      return true
    }
  },
  twoOuts: function(){
    var currentGame = Games.findOne({live: true});
    var outs = currentGame.outs
    if ( outs >= 2 ) {
      return true
    }
  },
  threeOuts: function(){
    var currentGame = Games.findOne({live: true});
    var outs = currentGame.outs
    if ( outs >= 3 ) {
      return true
    }
  },
  outs: function() {
    var currentGame = Games.findOne({live: true});
    return currentGame.outs
  }
});

Template.normalPlay.helpers({
  option6Exists: function () {
    var option6 = this.options.option6
    if (option6){
      return true
    }
  },
  option5Exists: function () {
    var option5 = this.options.option5
    if (option5){
      return true
    }
  }
});

Template.withoutIcons.helpers({
  option6Exists: function () {
    var option6 = this.options.option6
    if (option6){
      return true
    }
  },
  option5Exists: function () {
    var option5 = this.options.option5
    if (option5){
      return true
    }
  }
});

Template.playerCard.helpers({
  playerInfo: function () {
    var playerAtBat = AtBat.findOne({active: true})
    var playerId = playerAtBat.playerId
    var player = Players.findOne({_id: playerId})
    return player
  }
});
