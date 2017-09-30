POPOVER_BODY_PADDING = 6;

QuestionPopover = {
  show: function (templateName, data) {
    this.template = Template[templateName];
    this.view = Blaze.renderWithData(this.template, data, $('.ionic-body').get(0));

    var $backdrop = $(this.view.firstNode());
    var $popover = $backdrop.find('.question-popover');
    var bodyWidth = $('body').width();
    var bodyHeight = $(window).innerHeight();
    var popoverWidth = $popover.outerWidth();
    var popoverHeight = $popover.outerHeight();

    var popoverCSS = {
      marginLeft: '0',
      opacity: 1,
      marginLeft: "5%",
      marginTop: "35%",
      width: "90%",
      height: "80%",
    };

    $backdrop.addClass('active');
    $popover.css(popoverCSS);
  },

  hide: function () {
    if (typeof this.view !== 'undefined') {
      var $backdrop = $(this.view.firstNode());
      $backdrop.removeClass('active');

      var $popover = $backdrop.find('.question-popover');
      $popover.css({opacity: 0});

      Blaze.remove(this.view);
    }
  }
};

Template.questionPopover.rendered = function () {
  $(window).on('keyup.questionPopover', function(event) {
    if (event.which == 27) {
      QuestionPopover.hide();
    }
  });
};

Template.questionPopover.destroyed = function () {
  $(window).off('keyup.questionPopover');
};

Template.questionPopover.events({
  // Handle clicking the backdrop
  'click': function (event, template) {
    if ($(event.target).hasClass('popover-backdrop')) {
      QuestionPopover.hide();
    }
  }
});
