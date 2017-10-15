Cross Domain Utils
------------------

A set of utilities for dealing with cross-domain windows

## Public methods

### `getDomain(win : Window) => string`

Get the full domain of the specified window, as a string.

- `win` must be a window on the same domain as the current window, or an exception will be raised
- This can be overridden / mocked by setting `win.mockDomain = 'mock://some-domain.com';`. `mock://` is required to ensure the window can not spoof actual `http://` or `https://` domains

### `isBlankDomain(win : Window) => boolean`

Returns if the domain for the specified window is blank, or `about:blank`

- `win` must be a window on the same domain as the current window, or an exception will be raised
- `win` may be a window or iframe that has been newly opened by the current window

### `isSameDomain(win : Window) => boolean`

Returns if the specified window is on the same domain as the current window.

- Does so without raising any errors or console warnings, even in Safari where wrapping the check `try/catch` still raises a console warning.

### `getParent(win : Window) => ?Window`



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
