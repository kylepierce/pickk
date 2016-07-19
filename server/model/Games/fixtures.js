Fixtures.push(Games, {
  ActiveGame: {
    dateCreated: moment("2016-05-06").toDate(),
    createdBy: "CharlieDalton",
    name: "Denver vs Detroit",
    live: true,
    completed: false,
    commercial: false,
    gameDate: "Sept 27th 8:30pm",
    //time: "7pm", deprecated, use moment(gameDate).format for the purpose
    tv: "TBS",
    teams: [
      {
        teamId: "9DHSoikvkhSu5HhZm",
        batterNum : 5,
        pitcher: [ ],
        battingLineUp: [
          "MartinRamires",
          "ErikSmith"
        ]
      },
      {
        teamId: "viS9WMrotDrcH9kRe",
        batterNum: 0,
        pitcher: [ ],
        battingLineUp: [
          "JohnLubovsky",
          "SoerDaytona"
        ]
      }
    ],
    outs: 2,
    inning: 1,
    topOfInning: true,
    playersOnBase: {
      first: false,
      second: true,
      third: false
    },
    users: [],
    nonActive: [],
    current: {
      play: {
        playerId: "MartinRamires",
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        ballCount: 2,
        strikeCount: 1,
        pitchNumber: 4
      }
    },
    score: {
      home: 4,
      away: 4
    },
    plays: [
      {
        id: "0c78bbbf-8a15-4496-b770-f9292eff0fa2",
        outcome: "single",
        pitches: [
          {outcome: "ball"},
          {outcome: "strike"},
          {outcome: "strike"}
        ]
      },
      {
        id: "0c0c9569-8c19-4457-9c06-f99b7e14951e",
        outcome: "out",
        pitches: [
          {outcome: "ball"},
          {outcome: "out"}
        ]
      },
      {
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        outcome: "",
        pitches: [
          {outcome: "ball"},
          {outcome: "ball"}
        ]
      }
    ]
  },
  ScheduledGame: {
    dateCreated: moment("2016-05-06").toDate(),
    createdBy: "CharlieDalton",
    name: "Denver vs Detroit",
    live: false,
    completed: false,
    commercial: false,
    gameDate: "Sept 27th 8:30pm",
    //time: "7pm", deprecated, use moment(gameDate).format for the purpose
    tv: "TBS",
    teams: [
      {
        teamId: "9DHSoikvkhSu5HhZm",
        batterNum : 5,
        pitcher: [ ],
        battingLineUp: [
          "MartinRamires",
          "ErikSmith"
        ]
      },
      {
        teamId: "viS9WMrotDrcH9kRe",
        batterNum: 0,
        pitcher: [ ],
        battingLineUp: [
          "JohnLubovsky",
          "SoerDaytona"
        ]
      }
    ],
    outs: 2,
    inning: 1,
    topOfInning: true,
    playersOnBase: {
      first: false,
      second: true,
      third: false
    },
    users: [],
    nonActive: [],
    current: {
      play: {
        playerId: "MartinRamires",
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        ballCount: 2,
        strikeCount: 1,
        pitchNumber: 4
      }
    },
    score: {
      home: 4,
      away: 4
    },
    plays: [
      {
        id: "0c78bbbf-8a15-4496-b770-f9292eff0fa2",
        outcome: "double",
        pitches: [
          {outcome: "ball"},
          {outcome: "strike"},
          {outcome: "strike"}
        ]
      },
      {
        id: "0c0c9569-8c19-4457-9c06-f99b7e14951e",
        outcome: "out",
        pitches: [
          {outcome: "ball"},
          {outcome: "out"}
        ]
      },
      {
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        outcome: "",
        pitches: [
          {outcome: "ball"},
          {outcome: "ball"}
        ]
      }
    ]

  },
  ClosedGame: {
    dateCreated: moment("2016-05-06").toDate(),
    createdBy: "CharlieDalton",
    name: "Denver vs Detroit",
    live: true,
    completed: true,
    commercial: false,
    gameDate: "Sept 27th 8:30pm",
    //time: "7pm", deprecated, use moment(gameDate).format for the purpose
    tv: "TBS",
    teams: [
      {
        teamId: "9DHSoikvkhSu5HhZm",
        batterNum : 5,
        pitcher: [ ],
        battingLineUp: [
          "MartinRamires",
          "ErikSmith"
        ]
      },
      {
        teamId: "viS9WMrotDrcH9kRe",
        batterNum: 0,
        pitcher: [ ],
        battingLineUp: [
          "JohnLubovsky",
          "SoerDaytona"
        ]
      }
    ],
    outs: 2,
    inning: 1,
    topOfInning: true,
    playersOnBase: {
      first: false,
      second: true,
      third: false
    },
    users: [],
    nonActive: [],
    current: {
      play: {
        playerId: "MartinRamires",
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        ballCount: 2,
        strikeCount: 1,
        pitchNumber: 4
      }
    },
    score: {
      home: 4,
      away: 4
    },
    plays: [
      {
        id: "0c78bbbf-8a15-4496-b770-f9292eff0fa2",
        outcome: "triple",
        pitches: [
          {outcome: "ball"},
          {outcome: "strike"},
          {outcome: "strike"}
        ]
      },
      {
        id: "0c0c9569-8c19-4457-9c06-f99b7e14951e",
        outcome: "out",
        pitches: [
          {outcome: "ball"},
          {outcome: "out"}
        ]
      },
      {
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        outcome: "",
        pitches: [
          {outcome: "ball"},
          {outcome: "ball"}
        ]
      }
    ]

  },
  CommercialBreakGame: {
    dateCreated: moment("2016-05-06").toDate(),
    createdBy: "CharlieDalton",
    name: "Denver vs Detroit",
    live: true,
    completed: false,
    commercial: true,
    gameDate: "Today",
    //time: "7pm", deprecated, use moment(gameDate).format for the purpose
    tv: "TBS",
    teams: [
      {
        teamId: "9DHSoikvkhSu5HhZm",
        batterNum : 5,
        pitcher: [ ],
        battingLineUp: [
          "MartinRamires",
          "ErikSmith"
        ]
      },
      {
        teamId: "viS9WMrotDrcH9kRe",
        batterNum: 0,
        pitcher: [ ],
        battingLineUp: [
          "JohnLubovsky",
          "SoerDaytona"
        ]
      }
    ],
    outs: 2,
    inning: 1,
    topOfInning: true,
    playersOnBase: {
      first: false,
      second: true,
      third: false
    },
    users: [],
    nonActive: [],
    current: {
      play: {
        playerId: "MartinRamires",
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        ballCount: 2,
        strikeCount: 1,
        pitchNumber: 4
      }
    },
    score: {
      home: 4,
      away: 4
    },
    plays: [
      {
        id: "0c78bbbf-8a15-4496-b770-f9292eff0fa2",
        outcome: "home run",
        pitches: [
          {outcome: "ball"},
          {outcome: "strike"},
          {outcome: "strike"}
        ]
      },
      {
        id: "0c0c9569-8c19-4457-9c06-f99b7e14951e",
        outcome: "out",
        pitches: [
          {outcome: "ball"},
          {outcome: "out"}
        ]
      },
      {
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        outcome: "",
        pitches: [
          {outcome: "ball"},
          {outcome: "ball"}
        ]
      }
    ]

  },
  NoOutsGame: {
    dateCreated: moment("2016-05-06").toDate(),
    createdBy: "CharlieDalton",
    name: "Denver vs Detroit",
    live: true,
    completed: false,
    commercial: false,
    gameDate: "Today",
    //time: "7pm", deprecated, use moment(gameDate).format for the purpose
    tv: "TBS",
    teams: [
      {
        teamId: "9DHSoikvkhSu5HhZm",
        batterNum : 5,
        pitcher: [ ],
        battingLineUp: [
          "MartinRamires",
          "ErikSmith"
        ]
      },
      {
        teamId: "viS9WMrotDrcH9kRe",
        batterNum: 0,
        pitcher: [ ],
        battingLineUp: [
          "JohnLubovsky",
          "SoerDaytona"
        ]
      }
    ],
    outs: 0,
    inning: 1,
    topOfInning: true,
    playersOnBase: {
      first: false,
      second: true,
      third: false
    },
    users: [],
    nonActive: [],
    current: {
      play: {
        playerId: "MartinRamires",
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        ballCount: 2,
        strikeCount: 1,
        pitchNumber: 4
      }
    },
    score: {
      home: 4,
      away: 4
    },
    plays: [
      {
        id: "0c78bbbf-8a15-4496-b770-f9292eff0fa2",
        outcome: "single",
        pitches: [
          {outcome: "ball"},
          {outcome: "strike"},
          {outcome: "strike"}
        ]
      },
      {
        id: "0c0c9569-8c19-4457-9c06-f99b7e14951e",
        outcome: "out",
        pitches: [
          {outcome: "ball"},
          {outcome: "out"}
        ]
      },
      {
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        outcome: "",
        pitches: [
          {outcome: "ball"},
          {outcome: "ball"}
        ]
      }
    ]

  },
  SecondHalfGame: {
    dateCreated: moment("2016-05-06").toDate(),
    createdBy: "CharlieDalton",
    name: "Denver vs Detroit",
    live: true,
    completed: false,
    commercial: false,
    gameDate: "Today",
    //time: "7pm", deprecated, use moment(gameDate).format for the purpose
    tv: "TBS",
    teams: [
      {
        teamId: "9DHSoikvkhSu5HhZm",
        batterNum : 5,
        pitcher: [ ],
        battingLineUp: [
          "MartinRamires",
          "ErikSmith"
        ]
      },
      {
        teamId: "viS9WMrotDrcH9kRe",
        batterNum: 0,
        pitcher: [ ],
        battingLineUp: [
          "JohnLubovsky",
          "SoerDaytona"
        ]
      }
    ],
    outs: 0,
    inning: 1,
    topOfInning: false,
    playersOnBase: {
      first: false,
      second: true,
      third: false
    },
    users: [],
    nonActive: [],
    current: {
      play: {
        playerId: "MartinRamires",
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        ballCount: 2,
        strikeCount: 1,
        pitchNumber: 4
      }
    },
    score: {
      home: 4,
      away: 4
    },
    plays: [
      {
        id: "0c78bbbf-8a15-4496-b770-f9292eff0fa2",
        outcome: "single",
        pitches: [
          {outcome: "ball"},
          {outcome: "strike"},
          {outcome: "strike"}
        ]
      },
      {
        id: "0c0c9569-8c19-4457-9c06-f99b7e14951e",
        outcome: "out",
        pitches: [
          {outcome: "ball"},
          {outcome: "out"}
        ]
      },
      {
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        outcome: "",
        pitches: [
          {outcome: "ball"},
          {outcome: "ball"}
        ]
      }
    ]

  },
  AllBasesGame: {
    dateCreated: moment("2016-05-06").toDate(),
    createdBy: "CharlieDalton",
    name: "Denver vs Detroit",
    live: true,
    completed: false,
    commercial: false,
    gameDate: "Today",
    //time: "7pm", deprecated, use moment(gameDate).format for the purpose
    tv: "TBS",
    teams: [
      {
        teamId: "9DHSoikvkhSu5HhZm",
        batterNum : 5,
        pitcher: [ ],
        battingLineUp: [
          "MartinRamires",
          "ErikSmith"
        ]
      },
      {
        teamId: "viS9WMrotDrcH9kRe",
        batterNum: 0,
        pitcher: [ ],
        battingLineUp: [
          "JohnLubovsky",
          "SoerDaytona"
        ]
      }
    ],
    outs: 0,
    inning: 1,
    topOfInning: false,
    playersOnBase: {
      first: true,
      second: true,
      third: true
    },
    users: [],
    nonActive: [],
    current: {
      play: {
        playerId: "MartinRamires",
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        ballCount: 2,
        strikeCount: 1,
        pitchNumber: 4
      }
    },
    score: {
      home: 4,
      away: 4
    },
    plays: [
      {
        id: "0c78bbbf-8a15-4496-b770-f9292eff0fa2",
        outcome: "single",
        pitches: [
          {outcome: "ball"},
          {outcome: "strike"},
          {outcome: "strike"}
        ]
      },
      {
        id: "0c0c9569-8c19-4457-9c06-f99b7e14951e",
        outcome: "out",
        pitches: [
          {outcome: "ball"},
          {outcome: "out"}
        ]
      },
      {
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        outcome: "",
        pitches: [
          {outcome: "ball"},
          {outcome: "ball"}
        ]
      }
    ]

  },
  AnsweredGame: {
    dateCreated: moment("2016-05-06").toDate(),
    createdBy: "CharlieDalton",
    name: "Denver vs Detroit",
    live: true,
    completed: false,
    commercial: false,
    gameDate: "Today",
    //time: "7pm", deprecated, use moment(gameDate).format for the purpose
    tv: "TBS",
    teams: [
      {
        teamId: "9DHSoikvkhSu5HhZm",
        batterNum : 5,
        pitcher: [ ],
        battingLineUp: [
          "MartinRamires",
          "ErikSmith"
        ]
      },
      {
        teamId: "viS9WMrotDrcH9kRe",
        batterNum: 0,
        pitcher: [ ],
        battingLineUp: [
          "JohnLubovsky",
          "SoerDaytona"
        ]
      }
    ],
    outs: 0,
    inning: 1,
    topOfInning: false,
    playersOnBase: {
      first: true,
      second: true,
      third: true
    },
    users: ["CharlieDalton"],
    nonActive: [],
    current: {
      play: {
        playerId: "MartinRamires",
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        ballCount: 2,
        strikeCount: 1,
        pitchNumber: 4
      }
    },
    score: {
      home: 4,
      away: 4
    },
    plays: [
      {
        id: "0c78bbbf-8a15-4496-b770-f9292eff0fa2",
        outcome: "single",
        pitches: [
          {outcome: "ball"},
          {outcome: "strike"},
          {outcome: "strike"}
        ]
      },
      {
        id: "0c0c9569-8c19-4457-9c06-f99b7e14951e",
        outcome: "out",
        pitches: [
          {outcome: "ball"},
          {outcome: "out"}
        ]
      },
      {
        id: "f809a03e-c506-49fe-a5b9-4a69c22debb7",
        outcome: "",
        pitches: [
          {outcome: "ball"},
          {outcome: "ball"}
        ]
      }
    ]
  }
});
