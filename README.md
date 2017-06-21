Cross Domain Utils
------------------

A set of utilities for dealing with cross-domain windows

# Tasks

All of the tasks are listed in the package.json file under the scripts section

| Command        | Description  |          
| ------------- |:-------------:|
| npm run build | Builds the dist files |
| npm test      | Runs the test suite.  Lint + Type + Karma  |

# Debugging

Run the debug task and pass the next tasks as argument.

```
npm run debug -- npm run build
npm run debug -- npm test
npm run debug -- npm run karma -- --browsers=Chrome
```
