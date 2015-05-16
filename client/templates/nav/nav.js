settings = {
    dragger: null,
    disable: 'right',
    addBodyClasses: true,
    hyperextensible: true,
    resistance: 0.5,
    flickThreshold: 50,
    transitionSpeed: 0.3,
    easing: 'ease',
    maxPosition: 266,
    minPosition: -266,
    tapToClose: true,
    touchToDrag: true,
    slideIntent: 40,
    minDragDistance: 5
}

var snapper = new Snap({
  element: document.getElementById('fa-bars')
});


Template.nav.events({
    'click [data-action=toggleMenu]': function(){
        $(div.loginArea).toggleClass ("hidden-account", false);
    }
});