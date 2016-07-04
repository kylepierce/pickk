Fixtures.push(Games, {
  ActiveGame: {
    status: "inprogress",
    commercial: false,
    current: {
      outs: 2,
      play: {
        playerId: "MartinRamires",
        // optional ID! It's absent before the first pitch of the play
        id: "345-999",
        ballCount: 2,
        strikeCount: 1,
        pitchNumber: 4
      }
    },
    score: {
      home: 4,
      away: 4
    },
    plays: {
      "666-777": {
        outcome: "single",
        pitches: [
          {outcome: "ball"},
          {outcome: "strike"},
          {outcome: "strike"}
        ]
      },
      "345-998": {
        outcome: "out",
        pitches: [
          {outcome: "ball"},
          {outcome: "out"}
        ]
      },
      "345-999": {
        pitches: [
          {outcome: "ball"},
          {outcome: "ball"}
        ]
      }
    }
  },
  InactiveGame: {
    status: "closed",
    commercial: false,
    score: {
      home: 9,
      away: 7
    },
    plays: {
      "666-777": {
        outcome: "homerun",
        pitches: [
          {outcome: "ball"},
          {outcome: "strike"},
          {outcome: "strike"}
        ]
      }
    }
  }
});
