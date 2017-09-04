Template.heroSection.rendered = function(){
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

Template.heroSection.helpers({
  heros: function () {
    return Hero.find({}).fetch();
  },
});
