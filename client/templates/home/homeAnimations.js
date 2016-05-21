
Template.activeQuestion.animations({
  ".container-item": {
    container: ".container", // container of the ".item" elements
    insert: {
      class: "animated fast slideInLeft", // class applied to inserted elements
      before: function(attrs, element, template) {
        $( "#normalCard" ).css("display", "")
      }, // callback before the insert animation is triggered
      after: function(attrs, element, template) {}, // callback after an element gets inserted
      delay: 200 // Delay before inserted items animate
    },
    animateInitial: true, // animate the elements already rendered
    animateInitialStep: 200, // Step between animations for each initial item
    animateInitialDelay: 200 // Delay before the initial items animate
  }
});

Template.twoOptionQuestions.animations({
  ".container-item": {
    container: ".container", // container of the ".item" elements
    insert: {
      class: "animated fast slideInLeft", // class applied to inserted elements
      before: function(attrs, element, template) {
        $( "#normalCard" ).css("display", "")
      }, // callback before the insert animation is triggered
      after: function(attrs, element, template) {}, // callback after an element gets inserted
      delay: 200 // Delay before inserted items animate
    },
    animateInitial: true, // animate the elements already rendered
    animateInitialStep: 200, // Step between animations for each initial item
    animateInitialDelay: 500 // Delay before the initial items animate
  }
});

Template.commercialQuestion.animations({
  ".container-item": {
    container: ".container", // container of the ".item" elements
    insert: {
      class: "animated fast slideInLeft", // class applied to inserted elements
      before: function(attrs, element, template) {
        $( "#commercialCard" ).css("display", "")
      }, // callback before the insert animation is triggered
      after: function(attrs, element, template) {}, // callback after an element gets inserted
      delay: 200 // Delay before inserted items animate
    },
    animateInitial: true, // animate the elements already rendered
    animateInitialStep: 200, // Step between animations for each initial item
    animateInitialDelay: 500 // Delay before the initial items animate
  }
});

Template.predictionQuestions.animations({
  ".container-item": {
    container: ".container", // container of the ".item" elements
    insert: {
      class: "animated fast slideInLeft", // class applied to inserted elements
      before: function(attrs, element, template) {
        $( "#gameCard" ).css("display", "")
      }, // callback before the insert animation is triggered
      after: function(attrs, element, template) {}, // callback after an element gets inserted
      delay: 200 // Delay before inserted items animate
    },
    animateInitial: true, // animate the elements already rendered
    animateInitialStep: 200, // Step between animations for each initial item
    animateInitialDelay: 500 // Delay before the initial items animate
  }
});


Template.binaryChoice.animations({
  ".container-item": {
    container: ".container", // container of the ".item" elements
    insert: {
      class: "animated fast slideInLeft", // class applied to inserted elements
      before: function(attrs, element, template) {
        $( "#binaryCard" ).css("display", "")
      }, // callback before the insert animation is triggered
      after: function(attrs, element, template) {
        
      }, // callback after an element gets inserted
      delay: 200 // Delay before inserted items animate
    },
    animateInitial: true, // animate the elements already rendered
    animateInitialStep: 200, // Step between animations for each initial item
    animateInitialDelay: 500 // Delay before the initial items animate
  }
});

Template.playerCard.animations({
  ".container-item": {
    container: ".container", // container of the ".item" elements
    insert: {
      class: "animated fast slideInLeft", // class applied to inserted elements
      before: function(attrs, element, template) {
        $( "#normalCard" ).css("display", "")
      }, // callback before the insert animation is triggered
      after: function(attrs, element, template) {}, // callback after an element gets inserted
      delay: 200 // Delay before inserted items animate
    },
    animateInitial: true, // animate the elements already rendered
    animateInitialStep: 200, // Step between animations for each initial item
    animateInitialDelay: 500 // Delay before the initial items animate
  }
});