Fixtures.push(Meteor.users, {
  CharlieDalton: {
    profile: {
      firstName: "Charlie",
      lastName: "Dalton",
      birthday: new Date("1992-02-29"),
      role: "admin"
    }
  },
  KnoxOverstreet: {
    profile: {
      firstName: "Knox",
      lastName: "Overstreet",
      birthday: new Date("1996-05-01")
    }
  }
});

Fixtures.pre(Meteor.users, function(users) {
  var _id, lastWeek, results, user;
  lastWeek = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  results = [];
  for (_id in users) {
    user = users[_id];
    _.defaults(user.profile, {
      username: _id
    });
    results.push(_.defaults(user, {
      emails: [
        {
          address: _id.toLowerCase() + "@example.com",
          verified: true
        }
      ],
      createdAt: lastWeek
    }));
  }
  return results;
});

Fixtures.post(Meteor.users, function(users) {
  var _id, now, results, user;
  now = new Date();
  results = [];
  for (_id in users) {
    user = users[_id];
    Accounts.setPassword(_id, "123123");
    results.push(Meteor.users.update(_id, {
      $set: {
        "profile.username": _id
      },
      $push: {
        "services.resume.loginTokens": {
          hashedToken: Accounts._hashLoginToken(_id),
          when: now
        }
      }
    }));
  }
  return results;
});
