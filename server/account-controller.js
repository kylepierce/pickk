AccountController = RouteController.extend({
    verifyEmail: function () {
        Accounts.verifyEmail(this.params.token, function () {
            Router.go('/verified');
        });
    }
});
