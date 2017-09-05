Template['afCheckboxGroup_ionic2'].events({
  'click .checkbox': function(e,t){
    $(e.currentTarget).toggleClass('play-selected');
  }
});

Template["afCheckboxGroup_ionic2"].helpers({
  img: function(){
    var lower = this.value.toLowerCase()
    var image = "/team-logos/" + lower + ".svg"
    return image
  },
  selected: function(){
    if (this.selected) {
      return "play-selected"
    }
  },
  atts: function selectedAttsAdjust() {
    var atts = _.clone(this.atts);
    if (this.selected) {
      atts.checked = "";
    }
    // remove data-schema-key attribute because we put it
    // on the entire group
    delete atts["data-schema-key"];
    return atts;
  },
  dsk: function dsk() {
    return {
      "data-schema-key": this.atts["data-schema-key"]
    }
  }
});

Template['afRadioGroup_ionic2'].events({
  'click .button-card': function(e,t){
    $(e.currentTarget.previousElementSibling)[0].checked = true
  }
});

Template["afRadioGroup_ionic2"].helpers({
  img: function(){
    var lower = this.value.toLowerCase()
    var image = "/icons/" + lower + ".svg"
    return image
  },
  atts: function selectedAttsAdjust() {
    var atts = _.clone(this.atts);
    if (this.selected) {
      atts.checked = "";
    }
    // remove data-schema-key attribute because we put it
    // on the entire group
    delete atts["data-schema-key"];
    return atts;
  },
  dsk: function dsk() {
    return {
      "data-schema-key": this.atts["data-schema-key"]
    }
  }
});

Template['afRadioGroup_small'].events({
  'click .button-card': function(e,t){
    $(e.currentTarget.previousElementSibling)[0].checked = true
  }
});

Template["afRadioGroup_small"].helpers({
  img: function(){
    var lower = this.value.toLowerCase()
    var image = "/team-logos/" + lower + ".svg"
    return image
  },
  atts: function selectedAttsAdjust() {
    var atts = _.clone(this.atts);
    if (this.selected) {
      atts.checked = "";
    }
    // remove data-schema-key attribute because we put it
    // on the entire group
    delete atts["data-schema-key"];
    return atts;
  },
  dsk: function dsk() {
    return {
      "data-schema-key": this.atts["data-schema-key"]
    }
  }
});

Template.afCheckboxGroup_games.onCreated(function() {
  Template.instance().maxGames = parseInt(this.data[0])
  Template.instance().maxPeriods= this.data[1]
});

Template['afCheckboxGroup_games'].events({
  'click .button-card': function(e,t){
    var count = $('.play-selected').length
    var max = t.maxGames

    if ($(e.currentTarget).hasClass('play-selected')){
      $(e.currentTarget).toggleClass('play-selected');
      $(e.currentTarget.previousElementSibling)[0].checked = false
    } else if(count >= max){
      sAlert.error("Max number of games (" + max + ") has already been selected.", {effect: 'slide', position: 'bottom', html: true});
    } else {
      $(e.currentTarget).toggleClass('play-selected');
      $(e.currentTarget.previousElementSibling)[0].checked = true
    }
  },
  'click [data-action=showGames]': function(e, t){
    var prev = this.selected
    this.selected = !prev
    $(e.currentTarget.nextElementSibling).toggleClass('hidden');
  }
});

Template["afCheckboxGroup_games"].helpers({
  games: function(){
    var start = moment(this.label).startOf('day').add(4, "h").toISOString();
    var finish = moment(this.label).endOf('day').add(4, "h").toISOString();
    var selector = {iso: {$gt: start, $lt: finish}}
    return Games.find(selector).fetch();
  },
  niceDate: function(date){
    return moment(date).format("dddd MMM, Do")
  },
  time: function(date){
    return moment(date).format("h:mm a")
  },
  count: function(){
    var start = moment(this.label).startOf('day').add(4, "h").toISOString();
    var finish = moment(this.label).endOf('day').add(4, "h").toISOString();
    var selector = {iso: {$gt: start, $lt: finish}}
    return Games.find(selector).count();
  },
  atts: function selectedAttsAdjust() {
    var atts = _.clone(this.atts);
    if (this.selected) {
      atts.checked = "";
    }
    delete atts["data-schema-key"];
    return atts;
  },
  dsk: function dsk() {
    return {
      "data-schema-key": this.atts["data-schema-key"]
    }
  }
});

Template.afCheckboxGroup_small.onCreated(function() {
  Template.instance().maxGames = parseInt(this.data[0])
  Template.instance().maxPeriods= this.data[1]
});

Template['afCheckboxGroup_small'].events({
  'click .button-card': function(e,t){
    var count = $('.play-selected').length
    var max = t.maxGames

    if ($(e.currentTarget).hasClass('play-selected')){
      $(e.currentTarget).toggleClass('play-selected');
      $(e.currentTarget.previousElementSibling)[0].checked = false
    } else if(count >= max){
      sAlert.error("Max number of periods (" + max + ") hav already been selected.", {effect: 'slide', position: 'bottom', html: true});
    } else {
      $(e.currentTarget).toggleClass('play-selected');
      $(e.currentTarget.previousElementSibling)[0].checked = true
    }
  },
  'click [data-action=showGames]': function(e, t){
    $(e.currentTarget.nextElementSibling).toggleClass('hidden');
  }
});

Template["afCheckboxGroup_small"].helpers({
  atts: function selectedAttsAdjust() {
    var atts = _.clone(this.atts);
    if (this.selected) {
      atts.checked = "";
    }
    delete atts["data-schema-key"];
    return atts;
  },
  dsk: function dsk() {
    return {
      "data-schema-key": this.atts["data-schema-key"]
    }
  }
});
