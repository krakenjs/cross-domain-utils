/* eslint max-lines: 0 */
import { isRegex, noop } from './util';
import { PROTOCOL, WILDCARD } from './constants';
var IE_WIN_ACCESS_ERROR = 'Call was rejected by callee.\r\n';
export function getActualProtocol(win) {
  if (win === void 0) {
    win = window;
  }

  return win.location.protocol;
}
export function getProtocol(win) {
  if (win === void 0) {
    win = window;
  }

  if (win.mockDomain) {
    var protocol = win.mockDomain.split('//')[0];

    if (protocol) {
      return protocol;
    }
  }

  return getActualProtocol(win);
}
export function isFileProtocol(win) {
  if (win === void 0) {
    win = window;
  }

  return getProtocol(win) === PROTOCOL.FILE;
}
export function isAboutProtocol(win) {
  if (win === void 0) {
    win = window;
  }

  return getProtocol(win) === PROTOCOL.ABOUT;
}
export function isMockProtocol(win) {
  if (win === void 0) {
    win = window;
  }

  return getProtocol(win) === PROTOCOL.MOCK;
}
export function getParent(win) {
  if (win === void 0) {
    win = window;
  }

  if (!win) {
    return;
  }

  try {
    if (win.parent && win.parent !== win) {
      return win.parent;
    }
  } catch (err) {// pass
  }
}
export function getOpener(win) {
  if (win === void 0) {
    win = window;
  }

  if (!win) {
    return;
  } // Make sure we're not actually an iframe which has had window.open() called on us


  if (getParent(win)) {
    return;
  }

  try {
    return win.opener;
  } catch (err) {// pass
  }
}
export function canReadFromWindow(win) {
  try {
    // $FlowFixMe
    noop(win && win.location && win.location.href);
    return true;
  } catch (err) {// pass
  }

  return false;
}
export function getActualDomain(win) {
  if (win === void 0) {
    win = window;
  }

  var location = win.location;

  if (!location) {
    throw new Error("Can not read window location");
  }

  var protocol = getActualProtocol(win);

  if (!protocol) {
    throw new Error("Can not read window protocol");
  }

  if (protocol === PROTOCOL.FILE) {
    return PROTOCOL.FILE + "//";
  }

  if (protocol === PROTOCOL.ABOUT) {
    var parent = getParent(win);

    if (parent && canReadFromWindow(parent)) {
      // $FlowFixMe
      return getActualDomain(parent);
    }

    return PROTOCOL.ABOUT + "//";
  }

  var host = location.host;

  if (!host) {
    throw new Error("Can not read window host");
  }

  return protocol + "//" + host;
}
export function getDomain(win) {
  if (win === void 0) {
    win = window;
  }

  var domain = getActualDomain(win);

  if (domain && win.mockDomain && win.mockDomain.indexOf(PROTOCOL.MOCK) === 0) {
    return win.mockDomain;
  }

  return domain;
}
export function isBlankDomain(win) {
  try {
    // $FlowFixMe
    if (!win.location.href) {
      return true;
    }

    if (win.location.href === 'about:blank') {
      return true;
    }
  } catch (err) {// pass
  }

  return false;
}
export function isActuallySameDomain(win) {
  try {
    if (win === window) {
      return true;
    }
  } catch (err) {// pass
  }

  try {
    var desc = Object.getOwnPropertyDescriptor(win, 'location');

    if (desc && desc.enumerable === false) {
      return false;
    }
  } catch (err) {// pass
  }

  try {
    // $FlowFixMe
    if (isAboutProtocol(win) && canReadFromWindow(win)) {
      return true;
    }
  } catch (err) {// pass
  }

  try {
    // $FlowFixMe
    if (isMockProtocol(win) && canReadFromWindow(win)) {
      return true;
    }
  } catch (err) {// pass
  }

  try {
    // $FlowFixMe
    if (getActualDomain(win) === getActualDomain(window)) {
      return true;
    }
  } catch (err) {// pass
  }

  return false;
}
export function isSameDomain(win) {
  if (!isActuallySameDomain(win)) {
    return false;
  }

  try {
    if (win === window) {
      return true;
    } // $FlowFixMe


    if (isAboutProtocol(win) && canReadFromWindow(win)) {
      return true;
    } // $FlowFixMe


    if (getDomain(window) === getDomain(win)) {
      return true;
    }
  } catch (err) {// pass
  }

  return false;
}
export function assertSameDomain(win) {
  if (!isSameDomain(win)) {
    throw new Error("Expected window to be same domain");
  } // $FlowFixMe


  return win;
}
export function getParents(win) {
  var result = [];

  try {
    while (win.parent !== win) {
      result.push(win.parent);
      win = win.parent;
    }
  } catch (err) {// pass
  }

  return result;
}
export function isAncestorParent(parent, child) {
  if (!parent || !child) {
    return false;
  }

  var childParent = getParent(child);

  if (childParent) {
    return childParent === parent;
  }

  if (getParents(child).indexOf(parent) !== -1) {
    return true;
  }

  return false;
}
export function getFrames(win) {
  var result = [];
  var frames;

  try {
    frames = win.frames;
  } catch (err) {
    frames = win;
  }

  var len;

  try {
    len = frames.length;
  } catch (err) {// pass
  }

  if (len === 0) {
    return result;
  }

  if (len) {
    for (var i = 0; i < len; i++) {
      var frame = void 0;

      try {
        frame = frames[i];
      } catch (err) {
        continue;
      }

      result.push(frame);
    }

    return result;
  }

  for (var _i = 0; _i < 100; _i++) {
    var _frame = void 0;

    try {
      _frame = frames[_i];
    } catch (err) {
      return result;
    }

    if (!_frame) {
      return result;
    }

    result.push(_frame);
  }

  return result;
}
export function getAllChildFrames(win) {
  var result = [];

  for (var _i3 = 0, _getFrames2 = getFrames(win); _i3 < _getFrames2.length; _i3++) {
    var frame = _getFrames2[_i3];
    result.push(frame);

    for (var _i5 = 0, _getAllChildFrames2 = getAllChildFrames(frame); _i5 < _getAllChildFrames2.length; _i5++) {
      var childFrame = _getAllChildFrames2[_i5];
      result.push(childFrame);
    }
  }

  return result;
}
export function getTop(win) {
  if (win === void 0) {
    win = window;
  }

  try {
    if (win.top) {
      return win.top;
    }
  } catch (err) {// pass
  }

  if (getParent(win) === win) {
    return win;
  }

  try {
    if (isAncestorParent(window, win) && window.top) {
      return window.top;
    }
  } catch (err) {// pass
  }

  try {
    if (isAncestorParent(win, window) && window.top) {
      return window.top;
    }
  } catch (err) {// pass
  }

  for (var _i7 = 0, _getAllChildFrames4 = getAllChildFrames(win); _i7 < _getAllChildFrames4.length; _i7++) {
    var frame = _getAllChildFrames4[_i7];

    try {
      if (frame.top) {
        return frame.top;
      }
    } catch (err) {// pass
    }

    if (getParent(frame) === frame) {
      return frame;
    }
  }
}
export function getNextOpener(win) {
  if (win === void 0) {
    win = window;
  }

  return getOpener(getTop(win) || win);
}
export function getUltimateTop(win) {
  if (win === void 0) {
    win = window;
  }

  var opener = getNextOpener(win);

  if (opener) {
    return getUltimateTop(opener);
  }

  return top;
}
export function getAllFramesInWindow(win) {
  var top = getTop(win);

  if (!top) {
    throw new Error("Can not determine top window");
  }

  var result = [].concat(getAllChildFrames(top), [top]); // Win may be in shadow dom

  if (result.indexOf(win) === -1) {
    result = [].concat(result, [win], getAllChildFrames(win));
  }

  return result;
}
export function getAllWindows(win) {
  if (win === void 0) {
    win = window;
  }

  var frames = getAllFramesInWindow(win);
  var opener = getNextOpener(win);

  if (opener) {
    return [].concat(getAllWindows(opener), frames);
  } else {
    return frames;
  }
}
export function isTop(win) {
  return win === getTop(win);
}
export function isFrameWindowClosed(frame) {
  if (!frame.contentWindow) {
    return true;
  }

  if (!frame.parentNode) {
    return true;
  }

  var doc = frame.ownerDocument;

  if (doc && doc.documentElement && !doc.documentElement.contains(frame)) {
    var parent = frame;

    while (parent.parentNode && parent.parentNode !== parent) {
      parent = parent.parentNode;
    } // $FlowFixMe


    if (!parent.host || !doc.documentElement.contains(parent.host)) {
      return true;
    }
  }

  return false;
}

function safeIndexOf(collection, item) {
  for (var i = 0; i < collection.length; i++) {
    try {
      if (collection[i] === item) {
        return i;
      }
    } catch (err) {// pass
    }
  }

  return -1;
}

var iframeWindows = [];
var iframeFrames = [];
export function isWindowClosed(win, allowMock) {
  if (allowMock === void 0) {
    allowMock = true;
  }

  try {
    if (win === window) {
      return false;
    }
  } catch (err) {
    return true;
  }

  try {
    if (!win) {
      return true;
    }
  } catch (err) {
    return true;
  }

  try {
    if (win.closed) {
      return true;
    }
  } catch (err) {
    // I love you so much IE
    if (err && err.message === IE_WIN_ACCESS_ERROR) {
      return false;
    }

    return true;
  }

  if (allowMock && isSameDomain(win)) {
    try {
      // $FlowFixMe
      if (win.mockclosed) {
        return true;
      }
    } catch (err) {// pass
    }
  } // Mobile safari


  try {
    if (!win.parent || !win.top) {
      return true;
    }
  } catch (err) {// pass
  } // Yes, this actually happens in IE. win === win errors out when the window
  // is from an iframe, and the iframe was removed from the page.


  try {
    noop(win === win); // eslint-disable-line no-self-compare
  } catch (err) {
    return true;
  } // IE orphaned frame


  var iframeIndex = safeIndexOf(iframeWindows, win);

  if (iframeIndex !== -1) {
    var frame = iframeFrames[iframeIndex];

    if (frame && isFrameWindowClosed(frame)) {
      return true;
    }
  }

  return false;
}

function cleanIframes() {
  for (var i = 0; i < iframeWindows.length; i++) {
    var closed = false;

    try {
      closed = iframeWindows[i].closed;
    } catch (err) {// pass
    }

    if (closed) {
      iframeFrames.splice(i, 1);
      iframeWindows.splice(i, 1);
    }
  }
}

export function linkFrameWindow(frame) {
  cleanIframes();

  if (frame && frame.contentWindow) {
    try {
      iframeWindows.push(frame.contentWindow);
      iframeFrames.push(frame);
    } catch (err) {// pass
    }
  }
}
export function getUserAgent(win) {
  win = win || window;
  return win.navigator.mockUserAgent || win.navigator.userAgent;
}
export function getFrameByName(win, name) {
  var winFrames = getFrames(win);

  for (var _i9 = 0; _i9 < winFrames.length; _i9++) {
    var childFrame = winFrames[_i9];

    try {
      // $FlowFixMe
      if (isSameDomain(childFrame) && childFrame.name === name && winFrames.indexOf(childFrame) !== -1) {
        return childFrame;
      }
    } catch (err) {// pass
    }
  }

  try {
    // $FlowFixMe
    if (winFrames.indexOf(win.frames[name]) !== -1) {
      // $FlowFixMe
      return win.frames[name];
    }
  } catch (err) {// pass
  }

  try {
    if (winFrames.indexOf(win[name]) !== -1) {
      return win[name];
    }
  } catch (err) {// pass
  }
}
export function findChildFrameByName(win, name) {
  var frame = getFrameByName(win, name);

  if (frame) {
    return frame;
  }

  for (var _i11 = 0, _getFrames4 = getFrames(win); _i11 < _getFrames4.length; _i11++) {
    var childFrame = _getFrames4[_i11];
    var namedFrame = findChildFrameByName(childFrame, name);

    if (namedFrame) {
      return namedFrame;
    }
  }
}
export function findFrameByName(win, name) {
  var frame = getFrameByName(win, name);

  if (frame) {
    return frame;
  }

  var top = getTop(win) || win;
  return findChildFrameByName(top, name);
}
export function isParent(win, frame) {
  var frameParent = getParent(frame);

  if (frameParent) {
    return frameParent === win;
  }

  for (var _i13 = 0, _getFrames6 = getFrames(win); _i13 < _getFrames6.length; _i13++) {
    var childFrame = _getFrames6[_i13];

    if (childFrame === frame) {
      return true;
    }
  }

  return false;
}
export function isOpener(parent, child) {
  return parent === getOpener(child);
}
export function getAncestor(win) {
  if (win === void 0) {
    win = window;
  }

  win = win || window;
  var opener = getOpener(win);

  if (opener) {
    return opener;
  }

  var parent = getParent(win);

  if (parent) {
    return parent;
  }
}
export function getAncestors(win) {
  var results = [];
  var ancestor = win;

  while (ancestor) {
    ancestor = getAncestor(ancestor);

    if (ancestor) {
      results.push(ancestor);
    }
  }

  return results;
}
export function isAncestor(parent, child) {
  var actualParent = getAncestor(child);

  if (actualParent) {
    if (actualParent === parent) {
      return true;
    }

    return false;
  }

  if (child === parent) {
    return false;
  }

  if (getTop(child) === child) {
    return false;
  }

  for (var _i15 = 0, _getFrames8 = getFrames(parent); _i15 < _getFrames8.length; _i15++) {
    var frame = _getFrames8[_i15];

    if (frame === child) {
      return true;
    }
  }

  return false;
}
export function isPopup(win) {
  if (win === void 0) {
    win = window;
  }

  return Boolean(getOpener(win));
}
export function isIframe(win) {
  if (win === void 0) {
    win = window;
  }

  return Boolean(getParent(win));
}
export function isFullpage(win) {
  if (win === void 0) {
    win = window;
  }

  return Boolean(!isIframe(win) && !isPopup(win));
}

function anyMatch(collection1, collection2) {
  for (var _i17 = 0; _i17 < collection1.length; _i17++) {
    var item1 = collection1[_i17];

    for (var _i19 = 0; _i19 < collection2.length; _i19++) {
      var item2 = collection2[_i19];

      if (item1 === item2) {
        return true;
      }
    }
  }

  return false;
}

export function getDistanceFromTop(win) {
  if (win === void 0) {
    win = window;
  }

  var distance = 0;
  var parent = win;

  while (parent) {
    parent = getParent(parent);

    if (parent) {
      distance += 1;
    }
  }

  return distance;
}
export function getNthParent(win, n) {
  if (n === void 0) {
    n = 1;
  }

  var parent = win;

  for (var i = 0; i < n; i++) {
    if (!parent) {
      return;
    }

    parent = getParent(parent);
  }

  return parent;
}
export function getNthParentFromTop(win, n) {
  if (n === void 0) {
    n = 1;
  }

  return getNthParent(win, getDistanceFromTop(win) - n);
}
export function isSameTopWindow(win1, win2) {
  var top1 = getTop(win1) || win1;
  var top2 = getTop(win2) || win2;

  try {
    if (top1 && top2) {
      if (top1 === top2) {
        return true;
      }

      return false;
    }
  } catch (err) {// pass
  }

  var allFrames1 = getAllFramesInWindow(win1);
  var allFrames2 = getAllFramesInWindow(win2);

  if (anyMatch(allFrames1, allFrames2)) {
    return true;
  }

  var opener1 = getOpener(top1);
  var opener2 = getOpener(top2);

  if (opener1 && anyMatch(getAllFramesInWindow(opener1), allFrames2)) {
    return false;
  }

  if (opener2 && anyMatch(getAllFramesInWindow(opener2), allFrames1)) {
    return false;
  }

  return false;
}
export function matchDomain(pattern, origin) {
  if (typeof pattern === 'string') {
    if (typeof origin === 'string') {
      return pattern === WILDCARD || origin === pattern;
    }

    if (isRegex(origin)) {
      return false;
    }

    if (Array.isArray(origin)) {
      return false;
    }
  }

  if (isRegex(pattern)) {
    if (isRegex(origin)) {
      return pattern.toString() === origin.toString();
    }

    if (Array.isArray(origin)) {
      return false;
    } // $FlowFixMe


    return Boolean(origin.match(pattern));
  }

  if (Array.isArray(pattern)) {
    if (Array.isArray(origin)) {
      return JSON.stringify(pattern) === JSON.stringify(origin);
    }

    if (isRegex(origin)) {
      return false;
    }

    return pattern.some(function (subpattern) {
      return matchDomain(subpattern, origin);
    });
  }

  return false;
}
export function stringifyDomainPattern(pattern) {
  if (Array.isArray(pattern)) {
    return "(" + pattern.join(' | ') + ")";
  } else if (isRegex(pattern)) {
    return "RegExp(" + pattern.toString() + ")";
  } else {
    return pattern.toString();
  }
}
export function getDomainFromUrl(url) {
  var domain;

  if (url.match(/^(https?|mock|file):\/\//)) {
    domain = url;
  } else {
    return getDomain();
  }

  domain = domain.split('/').slice(0, 3).join('/');
  return domain;
}
export function onCloseWindow(win, callback, delay, maxtime) {
  if (delay === void 0) {
    delay = 1000;
  }

  if (maxtime === void 0) {
    maxtime = Infinity;
  }

  var timeout;

  var check = function check() {
    if (isWindowClosed(win)) {
      if (timeout) {
        clearTimeout(timeout);
      }

      return callback();
    }

    if (maxtime <= 0) {
      clearTimeout(timeout);
    } else {
      maxtime -= delay;
      timeout = setTimeout(check, delay);
    }
  };

  check();
  return {
    cancel: function cancel() {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  };
} // eslint-disable-next-line complexity

export function isWindow(obj) {
  try {
    if (obj === window) {
      return true;
    }
  } catch (err) {
    if (err && err.message === IE_WIN_ACCESS_ERROR) {
      return true;
    }
  }

  try {
    // $FlowFixMe method-unbinding
    if (Object.prototype.toString.call(obj) === '[object Window]') {
      return true;
    }
  } catch (err) {
    if (err && err.message === IE_WIN_ACCESS_ERROR) {
      return true;
    }
  }

  try {
    if (window.Window && obj instanceof window.Window) {
      return true;
    }
  } catch (err) {
    if (err && err.message === IE_WIN_ACCESS_ERROR) {
      return true;
    }
  }

  try {
    if (obj && obj.self === obj) {
      return true;
    }
  } catch (err) {
    if (err && err.message === IE_WIN_ACCESS_ERROR) {
      return true;
    }
  }

  try {
    if (obj && obj.parent === obj) {
      return true;
    }
  } catch (err) {
    if (err && err.message === IE_WIN_ACCESS_ERROR) {
      return true;
    }
  }

  try {
    if (obj && obj.top === obj) {
      return true;
    }
  } catch (err) {
    if (err && err.message === IE_WIN_ACCESS_ERROR) {
      return true;
    }
  }

  try {
    if (noop(obj === obj) === '__unlikely_value__') {
      // eslint-disable-line no-self-compare
      return false;
    }
  } catch (err) {
    return true;
  }

  try {
    if (obj && obj.__cross_domain_utils_window_check__ === '__unlikely_value__') {
      return false;
    }
  } catch (err) {
    return true;
  }

  try {
    if ('postMessage' in obj && 'self' in obj && 'location' in obj) {
      return true;
    }
  } catch (err) {// pass
  }

  return false;
}
export function isBrowser() {
  return typeof window !== 'undefined' && typeof window.location !== 'undefined';
}
export function isCurrentDomain(domain) {
  if (!isBrowser()) {
    return false;
  }

  return getDomain() === domain;
}
export function isMockDomain(domain) {
  return domain.indexOf(PROTOCOL.MOCK) === 0;
}
export function normalizeMockUrl(url) {
  if (!isMockDomain(getDomainFromUrl(url))) {
    return url;
  }

  if (!__TEST__) {
    throw new Error("Mock urls not supported out of test mode");
  }

  return url.replace(/^mock:\/\/[^/]+/, getActualDomain(window));
}
export function getFrameForWindow(win) {
  if (isSameDomain(win)) {
    return assertSameDomain(win).frameElement;
  }

  for (var _i21 = 0, _document$querySelect2 = document.querySelectorAll('iframe'); _i21 < _document$querySelect2.length; _i21++) {
    var frame = _document$querySelect2[_i21];

    if (frame && frame.contentWindow && frame.contentWindow === win) {
      return frame;
    }
  }
}
export function closeWindow(win) {
  if (isIframe(win)) {
    var frame = getFrameForWindow(win);

    if (frame && frame.parentElement) {
      frame.parentElement.removeChild(frame);
      return;
    }
  }

  try {
    win.close();
  } catch (err) {// pass
  }
}