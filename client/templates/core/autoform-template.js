Template['afCheckboxGroup_ionic2'].events({
  'click .checkbox': function(e,t){
    var input = $("input[id='"+ this.value+"']")[0];
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

Template['afRadioGroup_games'].events({
  'click .button-card': function(e,t){
    $(e.currentTarget.previousElementSibling)[0].checked = true
  },
  'click [data-action=showGames]': function(e, t){
    console.log(e);
    $(e.currentTarget.nextElementSibling).toggleClass('hidden');
  }
});

Template["afRadioGroup_games"].helpers({
  games: function(){
    var start = moment(this.label).startOf('day').add(4, "h").toISOString();
    var finish = moment(this.label).endOf('day').add(4, "h").toISOString();
    var selector = {iso: {$gt: start, $lt: finish}}
    return Games.find(selector).fetch();
  },
  niceDate: function(date){
    return moment(date).format("MMM, Do")
  },
  count: function(){
    var start = moment(this.label).startOf('day').add(4, "h").toISOString();
    var finish = moment(this.label).endOf('day').add(4, "h").toISOString();
    var selector = {iso: {$gt: start, $lt: finish}}
    return Games.find(selector).count();
    // console.log(this);
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
