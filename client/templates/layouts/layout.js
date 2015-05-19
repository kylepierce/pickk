
Template.appLayout.events({
  'click [data-action=share-product]': function (event, template) {
    IonActionSheet.show({
      titleText: 'Share Product',
      buttons: [
        { text: '<i class="icon ion-social-twitter"></i> Tweet' },
        { text: '<i class="icon ion-ios-email"></i> Email' },
      ],
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        if (index === 0) {
          console.log('Tweet!');
        }
        if (index === 1) {
          console.log('Email!');
        }
        return true;
      }
    });
  },   
  'click [data-action=logout]': function () {
    AccountsTemplates.logout();
  }
});

Meteor.subscribe('leaderboard');


Template.appLayout.helpers({
  'username': function(){
    var currentUser = this.userId();
    return "Meow Mix"
    // return UserList.find({_id: currentUser}).fetch();
  }
}); 