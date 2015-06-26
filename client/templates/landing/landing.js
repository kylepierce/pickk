Template.landingLayout.rendered = function() {
  IonSideMenu.snapper.disable();
};

Template.landing.helper({
	'nextSlide' : function(){
		return $('onboard_play').slick('slickGoTo', 3, true);
	}
})