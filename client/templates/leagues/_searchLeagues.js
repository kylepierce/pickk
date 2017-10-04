Template.searchLeaguesBox.helpers({
  GroupsIndex: function() {
    return GroupsIndex;
  },
  href: function() {
    return Router.routes["league.show"].path({_id: this.__originalId})
  },
  inputAttributes: function(){
    return {placeholder: "Search..."}
  }
})
