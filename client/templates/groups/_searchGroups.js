Template.searchGroupBox.helpers({
  GroupsIndex: function() {
    return GroupsIndex;
  },
  href: function() {
    return Router.routes["league.show"].path({_id: this.__originalId})
  }
})
