Template.searchGroupBox.helpers({
  GroupsIndex: function() {
    return GroupsIndex;
  },
  href: function() {
    return Router.routes["group.show"].path({_id: this.__originalId})
  }
})
