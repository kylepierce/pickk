var dateCreatedTime = new Date("2016-05-06").getTime();

Fixtures.push(Questions, {
  AtBatQuestion: {
    dateCreated: new Date(dateCreatedTime += 60000),
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
    },
    usersAnswered: []
  },
  PitchQuestion: {
    dateCreated: new Date(dateCreatedTime += 60000),
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
    },
    usersAnswered: []
  },
  InactiveQuestionForActiveGame: {
    dateCreated: new Date(dateCreatedTime += 60000),
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
    usersAnswered: [],
    play: "option1"
  },
  InactiveQuestionForInactiveGame: {
    dateCreated: new Date(dateCreatedTime += 60000),
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
    usersAnswered: [],
    play: "option2"
  },
  CommercialQuestionForActiveGame: {
    dateCreated: new Date(dateCreatedTime += 60000),
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
    },
    usersAnswered: []
  },
  FiveOptionsQuestion: {
    dateCreated: new Date(dateCreatedTime += 60000),
    playerId: "ErikSmith",
    gameId: "ActiveGame",
    active: true,
    commercial: false,
    que: "End of Erik Smith's at bat.",
    options: {
      option1: {title: "Strike Out", multiplier: 2.1},
      option2: {title: "Ball", multiplier: 2.2},
      option3: {title: "Walk", multiplier: 2.3},
      option4: {title: "Foul Ball", multiplier: 2.4},
      option5: {title: "Out", multiplier: 2.5}
    },
    usersAnswered: []
  },
  SixOptionsQuestion: {
    dateCreated: new Date(dateCreatedTime += 60000),
    playerId: "ErikSmith",
    gameId: "ActiveGame",
    active: true,
    commercial: false,
    que: "End of Erik Smith's at bat.",
    options: {
      option1: {title: "Out", multiplier: 2.1},
      option2: {title: "Walk", multiplier: 2.2},
      option3: {title: "Single", multiplier: 2.3},
      option4: {title: "Double", multiplier: 2.4},
      option5: {title: "Triple", multiplier: 2.5},
      option6: {title: "Home Run", multiplier: 2.6}
    },
    usersAnswered: []
  },
  BinaryQuestion: {
    dateCreated: new Date(dateCreatedTime += 60000),
    playerId: "ErikSmith",
    gameId: "ActiveGame",
    active: true,
    commercial: true,
    binaryChoice: true,
    que: "Will Erik Smith Hit a Home Run in the 6th inning?",
    options: {
      option1: {title: "True"},
      option2: {title: "False"}
    },
    usersAnswered: []
  },
  NoPlayerQuestion: {
    dateCreated: new Date(dateCreatedTime += 60000),
    gameId: "ActiveGame",
    active: true,
    commercial: false,
    que: "What is an outcome of the bat?",
    options: {
      option1: {title: "Strike", multiplier: 2.1},
      option2: {title: "Ball", multiplier: 2.2},
      option3: {title: "Hit", multiplier: 2.3},
      option4: {title: "Out", multiplier: 2.4}
    },
    usersAnswered: []
  },
  FuturePredictionQuestion: {
    dateCreated: new Date(dateCreatedTime += 60000),
    playerId: "ErikSmith",
    gameId: "prediction",
    active: "future",
    commercial: false,
    que: "Buffalo Bills vs Houston Texans",
    options: {
      option1: {title: "Colorado Rockies Wins by 5+ runs", multiplier: 1},
      option2: {title: "Boston Red Sox Wins by 1 run", multiplier: 1},
      option3: {title: "Boston Red Sox Wins by 5+ runs", multiplier: 1}
    },
    usersAnswered: []
  },
  FutureActiveQuestion: {
    dateCreated: new Date(dateCreatedTime += 60000),
    playerId: "ErikSmith",
    gameId: "prediction",
    active: true,
    commercial: false,
    que: "Buffalo Bills vs Houston Texans",
    options: {
      option1: {title: "Colorado Rockies Wins by 5+ runs", multiplier: 1},
      option2: {title: "Boston Red Sox Wins by 1 run", multiplier: 1},
      option3: {title: "Boston Red Sox Wins by 5+ runs", multiplier: 1}
    },
    usersAnswered: []
  },
  FuturePendingQuestion: {
    dateCreated: new Date(dateCreatedTime += 60000),
    playerId: "ErikSmith",
    gameId: "prediction",
    active: "pending",
    commercial: false,
    que: "Buffalo Bills vs Houston Texans",
    options: {
      option1: {title: "Colorado Rockies Wins by 5+ runs", multiplier: 1},
      option2: {title: "Boston Red Sox Wins by 1 run", multiplier: 1},
      option3: {title: "Boston Red Sox Wins by 5+ runs", multiplier: 1}
    },
    usersAnswered: []
  },
});
