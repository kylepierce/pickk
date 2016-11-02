Template._situationalModal.helpers({
	situationalQuestions: function () {
		return Admin.find({situational: true}).fetch();
	}
});

Template._situationalModal.events({
	'click [data-action=addSituational]': function (e, t) {
		var gameId = Router.current().params._id
		var que = this.q.que
		Meteor.call('createTrueFalse', que, gameId)

		sAlert.success("Posted " + que + "!" , {effect: 'slide', position: 'bottom', html: true});
	},
	'click [data-action="situationalQuestion"]': function(event, template){
		var que = prompt('Question you would like to ask?')
		var gameId = Router.current().params._id
		
		Meteor.call('createTrueFalse', que, gameId)

		sAlert.success("Posted " + que + "!" , {effect: 'slide', position: 'bottom', html: true});
	},
});