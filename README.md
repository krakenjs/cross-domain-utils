Cross Domain Utils
------------------

A set of utilities for dealing with cross-domain windows

## Public methods

### `getDomain(win : Window) => string`

Get the full domain of the specified window, as a string.

- `win` must be a window on the same domain as the current window, or an exception will be raised
- This can be overridden / mocked by setting `win.mockDomain = 'mock://some-domain.com';`. `mock://` is required to ensure the window can not spoof actual `http://` or `https://` domains

### `getDomainFromUrl(url : string) => string`

Get the full domain from the specified url, as a string. 

- it will try to extract the domain from the url string if it starts with well known protocols (`http://`, `https://`, `file://`, and additionally `mock://` urls)
- if url string does not contain a known protocol, it will try to extract the domain calling `getDomain` using the current window as input

### `getActualDomain(win : Window) => string`

Same as `getDomain` but overriding / mocking is disabled. it will return the real full domain of the specified window.

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

### `getTop(win : Window) => Window`

Gets the top-level parent of the specified window.

### `getAllFramesInWindow(win : Window) => Array<Window>`

Returns an array of all recursive child frames found in a given window, and in the child-frames of that window, including the specified window.

- Recursively searches for all direct and indirect children

### `isTop(win : Window) => boolean`

Returns true if the specified window is the top level window, without any parents.

### `isFrameWindowClosed(frame : HTMLIFrameElement) => boolean`

Returns true if the window attached to an iframe element is closed, by checking if the frame is still attached to an open document.

- Prefer `isWindowClosed` when possible

### `isWindowClosed(win : Window) => boolean`

Returns true if a window has been closed

- In IE/Edge, this check is not 100% reliable for frame windows where the frame has been removed from the DOM. Such window objects give no indication that they are closed.

### `getUserAgent(win : Window) => string`

Gets the user agent for the specified window

- Window must be on the same domain as the current window
- Uses `win.navigator.mockUserAgent` if specified, to allow for mocking / tests.

### `getFrameByName(win : Window, name : string) => ?Window`

Gets a frame window with the given name, if it exists as a child of the specified window.

### `findChildFrameByName(win : Window, name : string) => ?Window`

Recursively searches for a given frame window inside the children specified window.

### `findFrameByName(win : Window, name : string) => ?Window`

Recursively searches for a given frame window inside the entire frame hierarchy of the specified window.

- Searches both the children and the parent windows recursively for the frame.

### `isParent(parent : Window, child : Window) => boolean`

Returns true if the specified parent window is the parent of the specified child window.

### `isOpener(opener : Window, child : Window) => boolean`

Returns true if the specified opener window is the opener of the specified child window.

### `getAncestor(win : Window) => ?Window`

Gets either the parent or the opener of the specified window, if either is present.

### `getAncestors(win : Window) => Array<Window>`

Recursively gets either the parent or the opener of the specified window, if either is present, and returns an array of the entire ancestor hierarchy.

### `isAncestor(ancestor : Window, child : Window) => boolean`

Returns true if the specified ancestor window is the parent or the opener of the specified child window.

### `isPopup(win : Window) => boolean`

Returns true if the specified window has been opened with `window.open` (i.e. if it is a popup window)

### `isIframe(win : Window) => boolean`

Returns true if the specified window has been opened as an iframe.

### `getDistanceFromTop(win : Window) => number`

Gets the numerical distance from the specified window to the top level window in that window's hierarchy.

- If the specified window is at the top, this will return 0.

### `getNthParent(win : Window, n : number) => ?Window`

Gets the window `n` levels up from the specified window, if it exists.

### `isSameTopWindow(win1 : window, win2 : Window) => boolean`

Returns true if the windows are in the same hierarchy, with the same top level window

- Will return false if one of the windows is a popup and the other window is not a frame inside that popup.

### `isWindow(obj : Window) => boolean`

Returns true if the specified object is a window instance

### `onCloseWindow(win : Window, callback : Function, interval : number) => { cancel : Function }`

Calls the callback when the specified window closes, with checks running on the specified interval.

- Returns a listener object with a `.cancel()` method, to stop the loop

### `matchDomain(pattern : (string | RegExp | Array<string>), domain : string) => boolean`

Returns true if the specified domain matches the pattern. The pattern can be one of:

- A literal string
- A regular expression
- An array of possible domains as strings

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
