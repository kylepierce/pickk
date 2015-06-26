// ProfileController=RouteController.extend({
//     template:"profile",
//     waitOn:function(){
//         var username = this.params.profile.username
//         return Meteor.subscribe("userProfile",username);
//         console.log(username)
//     },
//     data:function(){
//         var username=Router.current().params.username;
//         return UserList.findOne({
//             'profile.username':username
//         });
//     }
// });