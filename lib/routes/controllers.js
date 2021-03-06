Router.onBeforeAction(function () {
  var isResetPassword = this.url.includes('/reset-password/')
  
  if (isResetPassword) {
    this.next();
  } else if (
    (this.url != '/login' && this.url != '/register' && this.url != '/recover-password')
    && (! Meteor.userId())
    && (! Meteor.loggingIn())
  ) {
      this.redirect("landing");
  } else {
    this.next();
  }
}, {except: ["landing"]});

Router.configure({
  layoutTemplate: 'mainLayout'
});

AdminController = RouteController.extend({
  onBeforeAction: function() {
    var user = Meteor.user()
    var admin = user.profile.role
    if(admin !== "admin" || admin === null){
      Router.go('/')
    } else {
      this.next();
    }
  }
});

// 🚨🚨🚨
// BaseController = RouteController.extend({

// });

// // Stops users who are not signed in
// anonymousController = BaseController.extend({
//   layoutTemplate: 'landingLayout',
//   onBeforeAction: function(){
//     if (
//       (this.url != '/login' && this.url != '/register' && this.url != '/recover-password' && this.url != '/landing')
//       && (! Meteor.userId())
//       && (! Meteor.loggingIn())
//     ) {
//         this.redirect("landing");
//     } else {
//       this.next();
//     }
//   }
//   // Fix Next
//   // , {except: ["landing"]};
// });

// // Double check they are signed in
// authenticatedController = anonymousController.extend({
//   layoutTemplate: 'mainLayout',
//   waitOn: function(){
//     var currentUser = Meteor.userId()
//     return [
//       Meteor.subscribe('userData'),
//       Meteor.subscribe('findThisUsersLeagues', currentUser)
//     ];
//   },

//   onBeforeAction: function(){
//     if (!Meteor.loggingIn() && !Meteor.user()) {
//        Router.go('/landing');
//     }

//     if (Meteor.user()) {
//       var username = Meteor.user().profile.username;
//       var favoriteTeam = Meteor.user().profile.favoriteTeams;
//       if (username === "" || username === null || username === "undefined") {
//         Router.go('/newUserSettings')
//       } else if (!favoriteTeam){
//         Router.go('/newUserFavoriteTeams')
//       }
//     }
//     this.next();
//   },

//   action: function () {
//     this.render();
//   }
//   // Router.onBeforeAction(function() {
//   // var user = Meteor.user();

//   // if (user && ! user.profile.birthday) {
//   //   Router.go("/newUserSettings");
//   // } else {
//   //   this.next()
//   // }
//   // }, {except: ["newUserSettings"]});

//   // wait for the several subscriptions which a logged-in user needs
//   // the 'loading' template will be displayed until all subscriptions are ready
// });

// // Admin controller stops anyone without the role "admin" to reach pages that are admin.
// adminController = authenticatedController.extend({
//   onBeforeAction: function() {
//     var user = Meteor.user()
//     var admin = user.profile.role
//     if(admin !== "admin" || admin === null){
//       Router.go('/')
//     } else {
//       this.next();
//     }
//   }
// });


// AuthController = RouteController.extend({
//   waitOn: function() {
//     return [
//       Meteor.subscribe('userData')
//     ]
//   },
//   data: function () {
//     return {
//     }
//   },
//   onBeforeAction: function() {
//     return this.next();
//   }
// })

// Router.onBeforeAction(function() {
//   var user = Meteor.user();
//   var push = Push.enabled();
//   console.log(push)

//   if (user && ! user.profile.birthday) {
//     Router.go("/newUserSettings");
//   } else if (user && user.profile.isOnBoarded !== true) {
//     Router.go("/newUserSettings");
//   } else if (user && user.profile.isOnBoarded === true) {
//     Router.go("/");
//   } else {
//     this.next()
//   }
// }, {except: ["newUserSettings", "push-active", "newUserFavoriteTeams"]});

// Admin controller stops anyone without the role "admin" to reach pages that are admin.
