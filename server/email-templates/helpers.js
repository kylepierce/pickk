OriginalHandlebars.registerHelper('firstName', function (name) {
  console.log(name)
  if (!name) {
    console.log("The username is undefined. Going to call you bud")
  }
});