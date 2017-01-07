Template.singleUsername.helpers({
  username: function(){
    var user = this.user || UserList.findOne({_id: this.userId});
    if (user) {
      return user.profile.username
    }
  }
}); 

Template.singleUsername.onCreated(function() {
  if (!this.data.alreadySubscribed && !this.data.user) {
    this.subscribe('findSingleUsername', this.data.userId);
  }
});
