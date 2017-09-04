Template._leagueRequests.created = function() {
	IonPopover.hide();
};

Template._leagueRequests.helpers({
	requests: function(){
		if (this.league.requests > 0){
			return true;
		}
	},
	requestList: function () {
    var requests = this.league.requests
		Meteor.subscribe('leagueRequests', this.league._id);
		return UserList.find({_id: {$in: requests}}).fetch();
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
