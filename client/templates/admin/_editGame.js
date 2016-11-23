// Template._editGame.events({
// 	'click [data-action="open"]': function (e, t) {
// 		var gameId = this.game[0]._id
// 		Meteor.call('openGame', gameId)
// 		IonModal.close();
// 		sAlert.success("Opened Game" , {effect: 'slide', position: 'bottom', html: true});
// 	},
// 	'click [data-action="end"]': function (e, t) {
// 		var gameId = this.game[0]._id
// 		if(confirm("Are you sure?")) {
// 			Meteor.call('endGame', gameId)
// 			IonModal.close();
// 			sAlert.success("Closed Game" , {effect: 'slide', position: 'bottom', html: true});
// 		}
// 	},
// 	// 'click [data-action="editQuarter"]': function (e,t){
// 	// 	IonPopover.show('_editQuarter', t.data, e.currentTarget)
// 	// },
// 	// 'click [data-action="goToQuarter"]': function (e,t) {
// 	// 	console.log(this,e,t)
// 	// },
// 	// 'click [data-action="closeQuarter"]': function (e,t) {
// 	// 	console.log(this,e,t)
// 	// },
// });

// Template._editGame.helpers({
// 	gameOpen: function () {
// 		var game = this.game[0]
// 		var status = game && game.status === "inprogress" && game.live === true
//     if (status){
//       return true
//     }
// 	},
// 	endOfGame: function () {
// 		var game = this.game[0]
// 		var status = game && game.status === "completed"
//     if (status){
//       return true
//     }
// 	}
// });