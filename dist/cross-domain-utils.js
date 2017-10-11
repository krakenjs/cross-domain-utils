(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("crossDomainUtils", [], factory);
	else if(typeof exports === 'object')
		exports["crossDomainUtils"] = factory();
	else
		root["crossDomainUtils"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getActualDomain = getActualDomain;
exports.getDomain = getDomain;
exports.isBlankDomain = isBlankDomain;
exports.isActuallySameDomain = isActuallySameDomain;
exports.isSameDomain = isSameDomain;
exports.getParent = getParent;
exports.getOpener = getOpener;
exports.getParents = getParents;
exports.isAncestorParent = isAncestorParent;
exports.getFrames = getFrames;
exports.getAllChildFrames = getAllChildFrames;
exports.getTop = getTop;
exports.getAllFramesInWindow = getAllFramesInWindow;
exports.isTop = isTop;
exports.isFrameWindowClosed = isFrameWindowClosed;
exports.isWindowClosed = isWindowClosed;
exports.linkFrameWindow = linkFrameWindow;
exports.getUserAgent = getUserAgent;
exports.getFrameByName = getFrameByName;
exports.findChildFrameByName = findChildFrameByName;
exports.findFrameByName = findFrameByName;
exports.isParent = isParent;
exports.isOpener = isOpener;
exports.getAncestor = getAncestor;
exports.getAncestors = getAncestors;
exports.isAncestor = isAncestor;
exports.isPopup = isPopup;
exports.isIframe = isIframe;
exports.isFullpage = isFullpage;
exports.getDistanceFromTop = getDistanceFromTop;
exports.getNthParent = getNthParent;
exports.getNthParentFromTop = getNthParentFromTop;
exports.isSameTopWindow = isSameTopWindow;
exports.matchDomain = matchDomain;
exports.getDomainFromUrl = getDomainFromUrl;
exports.onCloseWindow = onCloseWindow;
exports.isWindow = isWindow;

var _util = __webpack_require__("./src/util.js");

var CONSTANTS = {
    MOCK_PROTOCOL: 'mock:',
    FILE_PROTOCOL: 'file:',
    WILDCARD: '*'
};

var IE_WIN_ACCESS_ERROR = 'Call was rejected by callee.\r\n';

function getActualDomain(win) {

    var location = win.location;

    if (!location) {
        throw new Error('Can not read window location');
    }

    var protocol = location.protocol;

    if (!protocol) {
        throw new Error('Can not read window protocol');
    }

    if (protocol === CONSTANTS.FILE_PROTOCOL) {
        return 'file://';
    }

    var host = location.host;

    if (!host) {
        throw new Error('Can not read window host');
    }

    return protocol + '//' + host;
}

function getDomain(win) {

    win = win || window;

    var domain = getActualDomain(win);

    if (domain && win.mockDomain && win.mockDomain.indexOf(CONSTANTS.MOCK_PROTOCOL) === 0) {
        return win.mockDomain;
    }

    return domain;
}

function isBlankDomain(win) {
    try {
        if (!win.location.href) {
            return true;
        }

        if (win.location.href === 'about:blank') {
            return true;
        }
    } catch (err) {
        // pass
    }

    return false;
}

function isActuallySameDomain(win) {

    try {
        var desc = Object.getOwnPropertyDescriptor(win, 'location');

        if (desc && desc.enumerable === false) {
            return false;
        }
    } catch (err) {
        // pass
    }

    try {
        if (isBlankDomain(win)) {
            return true;
        }

        // $FlowFixMe
        if (getActualDomain(win) === getActualDomain(window)) {
            return true;
        }
    } catch (err) {
        // pass
    }

    return false;
}

function isSameDomain(win) {

    if (!isActuallySameDomain(win)) {
        return false;
    }

    try {

        if (isBlankDomain(win)) {
            return true;
        }

        // $FlowFixMe
        if (getDomain(window) === getDomain(win)) {
            return true;
        }
    } catch (err) {
        // pass
    }

    return false;
}

function getParent(win) {

    if (!win) {
        return;
    }

    try {
        if (win.parent && win.parent !== win) {
            return win.parent;
        }
    } catch (err) {
        return;
    }
}

function getOpener(win) {

    if (!win) {
        return;
    }

    // Make sure we're not actually an iframe which has had window.open() called on us
    if (getParent(win)) {
        return;
    }

    try {
        return win.opener;
    } catch (err) {
        return;
    }
}

function getParents(win) {

    var result = [];

    try {

        while (win.parent !== win) {
            result.push(win.parent);
            win = win.parent;
        }
    } catch (err) {
        // pass
    }

    return result;
}

function isAncestorParent(parent, child) {

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

function getFrames(win) {

    var result = [];

    var frames = void 0;

    try {
        frames = win.frames;
    } catch (err) {
        frames = win;
    }

    var len = void 0;

    try {
        len = frames.length;
    } catch (err) {
        // pass
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

function getAllChildFrames(win) {

    var result = [];

    for (var _iterator = getFrames(win), _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
            if (_i2 >= _iterator.length) break;
            _ref = _iterator[_i2++];
        } else {
            _i2 = _iterator.next();
            if (_i2.done) break;
            _ref = _i2.value;
        }

        var frame = _ref;

        result.push(frame);

        for (var _iterator2 = getAllChildFrames(frame), _isArray2 = Array.isArray(_iterator2), _i3 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
                if (_i3 >= _iterator2.length) break;
                _ref2 = _iterator2[_i3++];
            } else {
                _i3 = _iterator2.next();
                if (_i3.done) break;
                _ref2 = _i3.value;
            }

            var childFrame = _ref2;

            result.push(childFrame);
        }
    }

    return result;
}

function getTop(win) {

    if (!win) {
        return;
    }

    try {
        if (win.top) {
            return win.top;
        }
    } catch (err) {
        // pass
    }

    if (getParent(win) === win) {
        return win;
    }

    try {
        if (isAncestorParent(window, win) && window.top) {
            return window.top;
        }
    } catch (err) {
        // pass
    }

    try {
        if (isAncestorParent(win, window) && window.top) {
            return window.top;
        }
    } catch (err) {
        // pass
    }

    for (var _iterator3 = getAllChildFrames(win), _isArray3 = Array.isArray(_iterator3), _i4 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
        var _ref3;

        if (_isArray3) {
            if (_i4 >= _iterator3.length) break;
            _ref3 = _iterator3[_i4++];
        } else {
            _i4 = _iterator3.next();
            if (_i4.done) break;
            _ref3 = _i4.value;
        }

        var frame = _ref3;

        try {
            if (frame.top) {
                return frame.top;
            }
        } catch (err) {
            // pass
        }

        if (getParent(frame) === frame) {
            return frame;
        }
    }
}

function getAllFramesInWindow(win) {
    var top = getTop(win);
    // $FlowFixMe
    return getAllChildFrames(top).concat(top);
}

function isTop(win) {
    return win === getTop(win);
}

function isFrameWindowClosed(frame) {

    if (!frame.contentWindow) {
        return true;
    }

    if (!frame.parentNode) {
        return true;
    }

    var doc = frame.ownerDocument;

    if (doc && doc.body && !doc.body.contains(frame)) {
        return true;
    }

    return false;
}

function safeIndexOf(collection, item) {
    for (var i = 0; i < collection.length; i++) {

        try {
            if (collection[i] === item) {
                return i;
            }
        } catch (err) {
            // pass
        }
    }

    return -1;
}

var iframeWindows = [];
var iframeFrames = [];

function isWindowClosed(win) {
    var allowMock = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


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
            if (win.mockclosed) {
                return true;
            }
        } catch (err) {
            // pass
        }
    }

    // Mobile safari

    try {
        if (!win.parent || !win.top) {
            return true;
        }
    } catch (err) {}
    // pass


    // Yes, this actually happens in IE. win === win errors out when the window
    // is from an iframe, and the iframe was removed from the page.

    try {
        (0, _util.noop)(win === win); // eslint-disable-line no-self-compare
    } catch (err) {
        return true;
    }

    // IE orphaned frame

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

    for (var i = 0; i < iframeFrames.length; i++) {
        if (isFrameWindowClosed(iframeFrames[i])) {
            iframeFrames.splice(i, 1);
            iframeWindows.splice(i, 1);
        }
    }

    for (var _i5 = 0; _i5 < iframeWindows.length; _i5++) {
        if (isWindowClosed(iframeWindows[_i5])) {
            iframeFrames.splice(_i5, 1);
            iframeWindows.splice(_i5, 1);
        }
    }
}

function linkFrameWindow(frame) {

    cleanIframes();

    if (frame && frame.contentWindow) {
        try {
            iframeWindows.push(frame.contentWindow);
            iframeFrames.push(frame);
        } catch (err) {
            // pass
        }
    }
}

function getUserAgent(win) {
    win = win || window;
    return win.navigator.mockUserAgent || win.navigator.userAgent;
}

function getFrameByName(win, name) {

    var winFrames = getFrames(win);

    for (var _iterator4 = winFrames, _isArray4 = Array.isArray(_iterator4), _i6 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
        var _ref4;

        if (_isArray4) {
            if (_i6 >= _iterator4.length) break;
            _ref4 = _iterator4[_i6++];
        } else {
            _i6 = _iterator4.next();
            if (_i6.done) break;
            _ref4 = _i6.value;
        }

        var childFrame = _ref4;

        try {
            if (isSameDomain(childFrame) && childFrame.name === name && winFrames.indexOf(childFrame) !== -1) {
                return childFrame;
            }
        } catch (err) {
            // pass
        }
    }

    try {
        // $FlowFixMe
        if (winFrames.indexOf(win.frames[name]) !== -1) {
            // $FlowFixMe
            return win.frames[name];
        }
    } catch (err) {
        // pass
    }

    try {
        if (winFrames.indexOf(win[name]) !== -1) {
            return win[name];
        }
    } catch (err) {
        // pass
    }
}

function findChildFrameByName(win, name) {

    var frame = getFrameByName(win, name);

    if (frame) {
        return frame;
    }

    for (var _iterator5 = getFrames(win), _isArray5 = Array.isArray(_iterator5), _i7 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
        var _ref5;

        if (_isArray5) {
            if (_i7 >= _iterator5.length) break;
            _ref5 = _iterator5[_i7++];
        } else {
            _i7 = _iterator5.next();
            if (_i7.done) break;
            _ref5 = _i7.value;
        }

        var childFrame = _ref5;

        var namedFrame = findChildFrameByName(childFrame, name);

        if (namedFrame) {
            return namedFrame;
        }
    }
}

function findFrameByName(win, name) {

    var frame = void 0;

    frame = getFrameByName(win, name);

    if (frame) {
        return frame;
    }

    var top = getTop(win) || win;

    return findChildFrameByName(top, name);
}

function isParent(win, frame) {

    var frameParent = getParent(frame);

    if (frameParent) {
        return frameParent === win;
    }

    for (var _iterator6 = getFrames(win), _isArray6 = Array.isArray(_iterator6), _i8 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
        var _ref6;

        if (_isArray6) {
            if (_i8 >= _iterator6.length) break;
            _ref6 = _iterator6[_i8++];
        } else {
            _i8 = _iterator6.next();
            if (_i8.done) break;
            _ref6 = _i8.value;
        }

        var childFrame = _ref6;

        if (childFrame === frame) {
            return true;
        }
    }

    return false;
}

function isOpener(parent, child) {

    return parent === getOpener(child);
}

function getAncestor(win) {
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

function getAncestors(win) {

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

function isAncestor(parent, child) {

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

    for (var _iterator7 = getFrames(parent), _isArray7 = Array.isArray(_iterator7), _i9 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
        var _ref7;

        if (_isArray7) {
            if (_i9 >= _iterator7.length) break;
            _ref7 = _iterator7[_i9++];
        } else {
            _i9 = _iterator7.next();
            if (_i9.done) break;
            _ref7 = _i9.value;
        }

        var frame = _ref7;

        if (frame === child) {
            return true;
        }
    }

    return false;
}

function isPopup() {
    return Boolean(getOpener(window));
}

function isIframe() {
    return Boolean(getParent(window));
}

function isFullpage() {
    return Boolean(!isIframe() && !isPopup());
}

function anyMatch(collection1, collection2) {

    for (var _iterator8 = collection1, _isArray8 = Array.isArray(_iterator8), _i10 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
        var _ref8;

        if (_isArray8) {
            if (_i10 >= _iterator8.length) break;
            _ref8 = _iterator8[_i10++];
        } else {
            _i10 = _iterator8.next();
            if (_i10.done) break;
            _ref8 = _i10.value;
        }

        var item1 = _ref8;

        for (var _iterator9 = collection2, _isArray9 = Array.isArray(_iterator9), _i11 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
            var _ref9;

            if (_isArray9) {
                if (_i11 >= _iterator9.length) break;
                _ref9 = _iterator9[_i11++];
            } else {
                _i11 = _iterator9.next();
                if (_i11.done) break;
                _ref9 = _i11.value;
            }

            var item2 = _ref9;

            if (item1 === item2) {
                return true;
            }
        }
    }

    return false;
}

function getDistanceFromTop() {
    var win = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

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

function getNthParent(win) {
    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var parent = win;

    for (var i = 0; i < n; i++) {
        if (!parent) {
            return;
        }

        parent = getParent(parent);
    }

    return parent;
}

function getNthParentFromTop(win) {
    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    return getNthParent(win, getDistanceFromTop(win) - n);
}

function isSameTopWindow(win1, win2) {

    var top1 = getTop(win1) || win1;
    var top2 = getTop(win2) || win2;

    try {
        if (top1 && top2) {
            if (top1 === top2) {
                return true;
            }

            return false;
        }
    } catch (err) {
        // pass
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

function matchDomain(pattern, origin) {

    if (typeof pattern === 'string') {

        if (typeof origin === 'string') {
            return pattern === CONSTANTS.WILDCARD || origin === pattern;
        }

        if ((0, _util.isRegex)(origin)) {
            return false;
        }

        if (Array.isArray(origin)) {
            return false;
        }
    }

    if ((0, _util.isRegex)(pattern)) {

        if ((0, _util.isRegex)(origin)) {
            return pattern.toString() === origin.toString();
        }

        if (Array.isArray(origin)) {
            return false;
        }

        // $FlowFixMe
        return Boolean(origin.match(pattern));
    }

    if (Array.isArray(pattern)) {

        if (Array.isArray(origin)) {
            return JSON.stringify(pattern) === JSON.stringify(origin);
        }

        if ((0, _util.isRegex)(origin)) {
            return false;
        }

        return pattern.some(function (subpattern) {
            return matchDomain(subpattern, origin);
        });
    }

    return false;
}

function getDomainFromUrl(url) {

    var domain = void 0;

    if (url.match(/^(https?|mock|file):\/\//)) {
        domain = url;
    } else {
        return getDomain();
    }

    domain = domain.split('/').slice(0, 3).join('/');

    return domain;
}

function onCloseWindow(win, callback) {
    var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
    var maxtime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Infinity;


    var timeout = void 0;

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
}

function isWindow(obj) {

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
        (0, _util.noop)(obj === obj); // eslint-disable-line no-self-compare
    } catch (err) {
        return true;
    }

    try {
        (0, _util.noop)(obj && obj.__cross_domain_utils_window_check__);
    } catch (err) {
        return true;
    }

    return false;
}

/***/ }),

/***/ "./src/util.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isRegex = isRegex;
exports.noop = noop;
function isRegex(item) {
    return Object.prototype.toString.call(item) === '[object RegExp]';
}

function noop() {
    // pass
}

/***/ })

/******/ });
});
//# sourceMappingURL=cross-domain-utils.js.map