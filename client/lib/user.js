Template.userObj.helpers({
	user: function (userId) {
	  var user = this.user || UserList.findOne({_id: this.userId}) || UserList.findOne({_id: userId});
	}
})

Template.userObj.onCreated(function() {
  if (!this.data.alreadySubscribed && !this.data.user) {
    this.subscribe('findSingleUsername', this.data.userId);
  }
});