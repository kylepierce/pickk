Template._editGame.events({
	'click .item': function (e, t) {
		console.log(e,t,1)
		var selected = e.target.id
		var gameId = t.data.game[0]._id
		Router.go('/admin/game/' + gameId + "/" + selected)
	},
	'click [data-action="2"]': function (e, t) {
		console.log(2)
	},
});