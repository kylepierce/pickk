# Pickk ReadMe

## Quick Start

Run the project: ./bin/run

Deploy the project on “stag” server: ./bin/deploy stag

See the logs: ./bin/logs stag

Access production mongo: ./bin/production-mongo

-------
### Scripts

The developer must use the scripts to run & deploy the project - otherwise he’ll break the production app by deploying a new version with old settings

The scripts are located in “bin” folder.

Here are scripts’ descriptions:

./bin/run (merge the settings, run the project)

./bin/reset (reset the project, call ./bin/run)

./bin/test (merge the settings, run it in test mode)

./bin/deploy (deploy the project with correct settings)

./bin/logs (see the logs)

./bin/dmongo (access local mongo database)

./bin/build-ios (merge the settings, build the iOS version of the application)

./bin/autologin (impersonate another user in production application - useful for debugging)

./bin/dump-download (download the dump from production database)
./bin/dump-restore (restore the downloaded dump into local database)

./bin/dump (download & restore the dump in a single command)

./bin/merge-settings (merge settings)

-------
### Settings

Settings files override each other in first-to-last order

Settings are loaded from the following files:

settings/all.json (generic settings committed to repository)

settings/all.specific.json (project-specific settings used for sensitive data, e.g. API keys & passwords, committed to a settings-specific repository)

settings/all.local.json (developer-specific settings used for temporary overrides (e.g. disabling console output); not committed to repository)

settings/%env%.json (environment-specific counterpart of "settings/all.json")

settings/%env%.specific.json (environment-specific counterpart of "settings/all.specific.json")

settings/%env%.local.json (environment-specific counterpart of "settings/all.local.json")

-----
## [Data Schema](https://docs.google.com/document/d/1ZDvnep8EnWKeMqWSUmbNrk8SSLp_BPHhIYUkbCOOGrQ/edit?usp=sharing)
----

## [Client Template Explanation](https://bitbucket.org/pickk/pickk/wiki/Client%20Templates)

---

## [List of Methods(In Progress)](https://bitbucket.org/pickk/pickk/wiki/Section%20Methods)