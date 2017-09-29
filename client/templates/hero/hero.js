Template.heroSection.onCreated(function(){
  this.subscribe('sectionHeros', [this.data.location])
});

Template.heroSection.helpers({
  heros: function () {
    return Hero.find({}).fetch();
  },
});

Template.heroInBetween.onRendered(function(){
  var self = this
  self.autorun(function() {
    if (self.subscriptionsReady()) {
      $('#hero-section').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 10000,
        accessibility: false,
        arrows: false,
        draggable: true,
      });
    }
  });
});

Template.heroInBetween.helpers({
  heros: function () {
    return Hero.find({}).fetch();
  },
});
