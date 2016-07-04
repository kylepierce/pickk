Fixtures.push(Questions, {
  AtBatQuestion: {
    dateCreated: moment("2016-05-06").toDate(),
    createdBy: "CharlieDalton",
    playerId: "MartinRamires",
    atBatQuestion: true,
    gameId: "ActiveGame",
    active: true,
    commercial: false,
    que: "First Down ...",
    options: {
      option1: {title: "Strike", multiplier: 2.1},
      option2: {title: "Ball", multiplier: 2.2},
      option3: {title: "Hit", multiplier: 2.3},
      option4: {title: "Out", multiplier: 2.4}
    }
  },
  PitchQuestion: {
    dateCreated: moment("2016-05-06").toDate(),
    createdBy: "CharlieDalton",
    playerId: "MartinRamires",
    gameId: "NoOutsGame",
    active: true,
    commercial: false,
    que: "Second Down ...",
    options: {
      option1: {title: "Strike", multiplier: 2.1},
      option2: {title: "Ball", multiplier: 2.2},
      option3: {title: "Hit", multiplier: 2.3},
      option4: {title: "Out", multiplier: 2.4}
    }
  },
  InactiveQuestionForActiveGame: {
    dateCreated: moment("2016-05-06").toDate(),
    createdBy: "CharlieDalton",
    playerId: "JohnLubovsky",
    gameId: "ActiveGame",
    active: false,
    commercial: false,
    que: "End of Colby Rasmus's at bat.",
    options: {
      option1: {title: "Strike", multiplier: 2.1},
      option2: {title: "Ball", multiplier: 2.2},
      option3: {title: "Hit", multiplier: 2.3},
      option4: {title: "Out", multiplier: 2.4}
    },
    play: "option1"
  },
  InactiveQuestionForInactiveGame: {
    dateCreated: moment("2016-05-06").toDate(),
    createdBy: "CharlieDalton",
    playerId: "JohnLubovsky",
    gameId: "ClosedGame",
    active: false,
    commercial: false,
    que: "Corey Seager: 3 - 0",
    options: {
      option1: {title: "Strike", multiplier: 2.1},
      option2: {title: "Ball", multiplier: 2.2},
      option3: {title: "Hit", multiplier: 2.3},
      option4: {title: "Out", multiplier: 2.4}
    },
    play: "option2"
  },
  CommercialQuestionForActiveGame: {
    dateCreated: moment("2016-05-06").toDate(),
    createdBy: "CharlieDalton",
    playerId: "JohnLubovsky",
    gameId: "ActiveGame",
    active: true,
    commercial: true,
    que: "How Will This Drive End?",
    options: {
      option1: {title: "Strike", multiplier: 2.1},
      option2: {title: "Ball", multiplier: 2.2},
      option3: {title: "Hit", multiplier: 2.3},
      option4: {title: "Out", multiplier: 2.4}
    }
  },
  FiveOptionsQuestion: {
    playerId: "ErikSmith",
    gameId: "ActiveGame",
    active: true,
    commercial: false,
    que: "Which is an outcome of the bat?",
    options: {
      option1: {title: "Strike Out", multiplier: 2.1},
      option2: {title: "Ball", multiplier: 2.2},
      option3: {title: "Walk", multiplier: 2.3},
      option4: {title: "Foul Ball", multiplier: 2.4},
      option5: {title: "Out", multiplier: 2.5}
    }
  },
  SixOptionsQuestion: {
    playerId: "ErikSmith",
    gameId: "ActiveGame",
    active: true,
    commercial: false,
    que: "Which is an outcome of the bat?",
    options: {
      option1: {title: "Out", multiplier: 2.1},
      option2: {title: "Walk", multiplier: 2.2},
      option3: {title: "Single", multiplier: 2.3},
      option4: {title: "Double", multiplier: 2.4},
      option5: {title: "Triple", multiplier: 2.5},
      option6: {title: "Home Run", multiplier: 2.6}
    }
  },
  BinaryQuestion: {
    playerId: "ErikSmith",
    gameId: "ActiveGame",
    active: true,
    commercial: false,
    binaryChoice: true,
    que: "Which is an outcome of the bat?",
    options: {
      option1: {title: "True", userPicked: []},
      option2: {title: "False", userPicked: []}
    }
  },
  NoPlayerQuestion: {
    gameId: "ActiveGame",
    active: true,
    commercial: false,
    que: "Which is an outcome of the bat?",
    options: {
      option1: {title: "Strike", multiplier: 2.1},
      option2: {title: "Ball", multiplier: 2.2},
      option3: {title: "Hit", multiplier: 2.3},
      option4: {title: "Out", multiplier: 2.4}
    }
  },
  FuturePredictionQuestion: {
    playerId: "ErikSmith",
    gameId: "prediction",
    active: "future",
    commercial: false,
    que: "Buffalo Bills vs Houston Texans",
    options: {
      option1: {title: "Colorado Rockies Wins by 5+ runs", userPicked: [], multiplier: 1},
      option2: {title: "Boston Red Sox Wins by 1 run", userPicked: [], multiplier: 1},
      option3: {title: "Boston Red Sox Wins by 5+ runs", userPicked: [], multiplier: 1}
    }
  },
  FutureActiveQuestion: {
    playerId: "ErikSmith",
    gameId: "prediction",
    active: true,
    commercial: false,
    que: "Buffalo Bills vs Houston Texans",
    options: {
      option1: {title: "Colorado Rockies Wins by 5+ runs", userPicked: [], multiplier: 1},
      option2: {title: "Boston Red Sox Wins by 1 run", userPicked: [], multiplier: 1},
      option3: {title: "Boston Red Sox Wins by 5+ runs", userPicked: [], multiplier: 1}
    }
  },
  FuturePendingQuestion: {
    playerId: "ErikSmith",
    gameId: "prediction",
    active: "pending",
    commercial: false,
    que: "Buffalo Bills vs Houston Texans",
    options: {
      option1: {title: "Colorado Rockies Wins by 5+ runs", userPicked: [], multiplier: 1},
      option2: {title: "Boston Red Sox Wins by 1 run", userPicked: [], multiplier: 1},
      option3: {title: "Boston Red Sox Wins by 5+ runs", userPicked: [], multiplier: 1}
    }
  },
});
