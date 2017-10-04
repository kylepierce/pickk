Template.heroOverview.helpers({
  heros: function(){
    return Hero.find().fetch();
  }
});
