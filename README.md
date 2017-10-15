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

Gets the parent of the specified window, if the window has a parent.

- Only returns the parent of iframes
- Returns void if the window is the top-level window

### `getOpener(win : Window) => ?Window`

Gets the opener of the specified window, if the window has an opener.

- Only returns the opener of windows opened with `window.open`
- Returns void if the window is the top-level window

### `getParents(win : Window) => Array<Window>`

Gets all of the hierarchical parents of the specified window.

- Only returns the parents of iframes
- Returns a blank array if the window is the top-level window

### `isAncestorParent(ancestor : Window, win : Window) => boolean`

Returns true if the `ancestor` is a direct or non-direct parent of the specified window.

### `getFrames(win : Window) => Array<Window>`

Returns an array of all direct child frames found in a given window.

- Only returns direct children

### `getAllChildFrames(win : Window) => Array<Window>`

Returns an array of all recursive child frames found in a given window, and in the child-frames of that window.

- Recursively searches for all direct and indirect children

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
