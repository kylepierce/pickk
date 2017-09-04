Template._leagueRequests.created = function() {
	IonPopover.hide();
};

Template._leagueRequests.helpers({
	user: function () {
    var leagueId = this.league._id
    var league = Groups.findOne({_id: leagueId});
		return league.requests
	},
	userDetails: function(userId){
		Meteor.subscribe('findSingleUsername', userId)
		return UserList.findOne({_id: userId})
	},

});

Template._leagueRequests.events({
	'click [data-action=accept]': function(e, t){
		var leagueId = t.data.league._id
		var user = this._id
		var commissionerUserId = Meteor.userId();
		Meteor.call('acceptLeagueRequest', leagueId, user, commissionerUserId);
	},
	'click [data-action=delete]': function(e, t){
		var leagueId = t.data.league._id
		var user = this._id
		var commissionerUserId = Meteor.userId();
		Meteor.call('denyLeagueRequest', leagueId, user, commissionerUserId);
	},
});
