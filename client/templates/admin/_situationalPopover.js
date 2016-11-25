Template._situationalModal.helpers({
	situationalQuestions: function () {
		return Admin.find({situational: true}).fetch();
	}
});

Template._situationalModal.events({
	'click [data-action=addSituational]': function (e, t) {
		var gameId = Router.current().params._id
		var game = Games.findOne({});
		var period = parseInt(Router.current().params.period)
		var que = this.q.que
		var q = {
			que: que,
			gameId: gameId,
			period: period 
		}
		Meteor.call('createTrueFalse', q)

		sAlert.success("Posted " + que + "!" , {effect: 'slide', position: 'bottom', html: true});
	},
	'click [data-action="situationalQuestion"]': function(event, template){
		var que = prompt('Question you would like to ask?')
		var game = Games.findOne({});
		var period = parseInt(Router.current().params.period)
		var gameId = Router.current().params._id
		var q = {
			que: que,
			gameId: gameId,
			period: period 
		}		
		Meteor.call('createTrueFalse', q)

		sAlert.success("Posted " + que + "!" , {effect: 'slide', position: 'bottom', html: true});
	},
});