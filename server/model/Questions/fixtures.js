Fixtures.push(Questions, {
  Question1: {
    playerId: "MartinRamires",
    atBatQuestion: true,
    gameId: "ActiveGame",
    active: true,
    commercial: false,
    que: "Who will win?",
    options: {
      option1: {title: "Answer #1", multiplier: 2.1},
      option2: {title: "Answer #2", multiplier: 2.2},
      option3: {title: "Answer #3", multiplier: 2.3},
      option4: {title: "Answer #4", multiplier: 2.4}
    }
  },
  Question2: {
    playerId: "MartinRamires",
    gameId: "ActiveGame",
    active: true,
    commercial: false,
    que: "Which is an outcome of the bat?",
    options: {
      option1: {title: "Answer #1", multiplier: 2.1},
      option2: {title: "Answer #2", multiplier: 2.2},
      option3: {title: "Answer #3", multiplier: 2.3}
    }
  },
  InactiveQuestion1: {
    playerId: "JohnLubovsky",
    gameId: "ActiveGame",
    active: false,
    commercial: false,
    que: "Which is an outcome of the bat?",
    options: {
      option1: {title: "Answer #1", multiplier: 2.1},
      option2: {title: "Answer #2", multiplier: 2.2},
      option3: {title: "Answer #3", multiplier: 2.3}
    }
  },
  InactiveQuestion2: {
    playerId: "ErikSmith",
    gameId: "InactiveGame",
    active: false,
    commercial: false,
    que: "Which is an outcome of the bat?",
    options: {
      option1: {title: "Answer #1", multiplier: 2.1},
      option2: {title: "Answer #2", multiplier: 2.2},
      option3: {title: "Answer #3", multiplier: 2.3}
    }
  },
});
