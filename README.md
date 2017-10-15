Cross Domain Utils
------------------

A set of utilities for dealing with cross-domain windows

# Public methods

## `getDomain(win : Window) => domain : string`

Get the full domain of a window object as a string.

- `win` must be a window on the same domain as the current window
- This can be overridden / mocked by setting `win.mockDomain = 'mock://some-domain.com';`. `mock://` is required to ensure the window can not spoof actual `http://` or `https://` domains


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
