Template._editGame.events({
	'click .item': function (e, t) {
		var selected = e.target.id
		var gameId = t.data.game[0]._id
		Router.go('/admin/game/' + gameId + "/" + selected)
		IonPopover.hide();
	}
});