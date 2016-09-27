Template.dailyPickks.helpers({
	dailyPickks: function () {
		return Questions.find().fetch();
	}
});

Template.dailyPickks.events({
	'click [data-action=play-selected]': function (e, t) {
    $('.play-selected').removeClass('play-selected ten-spacing')
    $(e.currentTarget).addClass('play-selected ten-spacing')
    var displayOptions = function ( o ) {
      // The select item dom and data
      var $selected = $(e.currentTarget)
      var selectedObj = o.dataPath
      var templateName = o.insertedTemplate

      var addOptions = function ( id, data ){
        var options = "<div id='" + id + "'></div>"
        $selected.after(options);
        var container = $('#' + id + '')[0]
        Blaze.renderWithData(templateName, data, container)
      }

      var container = $('#' + o.containerId + '')[0]
      if ( container ){
        if ( container.previousSibling !== $selected[0] ){
          container.remove();
          addOptions( o.containerId, selectedObj )  
        } else {
          container.remove();
        }
      } else {
        addOptions( o.containerId, selectedObj )  
      }
    }
    parms = {
      insertedTemplate: Template.submitButton,
      containerId: "submit",
      event: e,
      template: t,
      dataPath: this,
    }
    displayOptions( parms )
  },
}); 