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
exports.isActuallySameDomain = isActuallySameDomain;
exports.isSameDomain = isSameDomain;
exports.getParent = getParent;
exports.getOpener = getOpener;
exports.getParents = getParents;
exports.isAncestorParent = isAncestorParent;
exports.getFrames = getFrames;
exports.getAllChildFrames = getAllChildFrames;
exports.getAllFramesInWindow = getAllFramesInWindow;
exports.getTop = getTop;
exports.isTop = isTop;
exports.isWindowClosed = isWindowClosed;
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

var _util = __webpack_require__("./src/util.js");

var CONSTANTS = {
    MOCK_PROTOCOL: 'mock:',
    FILE_PROTOCOL: 'file:',
    WILDCARD: '*'
};

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

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = getFrames(win)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var frame = _step.value;

            result.push(frame);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = getAllChildFrames(frame)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var childFrame = _step2.value;

                    result.push(childFrame);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                        _iterator2['return']();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return result;
}

function getAllFramesInWindow(win) {

    var result = getAllChildFrames(win);

    result.push(win);

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = getParents(win)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var parent = _step3.value;


            result.push(parent);

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = getFrames(parent)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var frame = _step4.value;


                    if (result.indexOf(frame) === -1) {
                        result.push(frame);
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                        _iterator4['return']();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                _iterator3['return']();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
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
        if (isAncestorParent(window, win)) {
            return window.top;
        }
    } catch (err) {
        // pass
    }

    try {
        if (isAncestorParent(win, window)) {
            return window.top;
        }
    } catch (err) {
        // pass
    }

    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
        for (var _iterator5 = getAllChildFrames(win)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var frame = _step5.value;

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
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                _iterator5['return']();
            }
        } finally {
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }
}

function isTop(win) {
    return win === getTop(win);
}

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

        if (err && err.message === 'Call was rejected by callee.\r\n') {
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
    } catch (err) {
        // pass
    }

    return false;
}

function getUserAgent(win) {
    win = win || window;
    return win.navigator.mockUserAgent || win.navigator.userAgent;
}

function getFrameByName(win, name) {

    var winFrames = getFrames(win);

    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
        for (var _iterator6 = winFrames[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var childFrame = _step6.value;

            try {
                if (isSameDomain(childFrame) && childFrame.name === name && winFrames.indexOf(childFrame) !== -1) {
                    return childFrame;
                }
            } catch (err) {
                // pass
            }
        }
    } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                _iterator6['return']();
            }
        } finally {
            if (_didIteratorError6) {
                throw _iteratorError6;
            }
        }
    }

    try {
        if (winFrames.indexOf(win.frames[name]) !== -1) {
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

    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
        for (var _iterator7 = getFrames(win)[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var childFrame = _step7.value;

            var namedFrame = findChildFrameByName(childFrame, name);

            if (namedFrame) {
                return namedFrame;
            }
        }
    } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion7 && _iterator7['return']) {
                _iterator7['return']();
            }
        } finally {
            if (_didIteratorError7) {
                throw _iteratorError7;
            }
        }
    }
}

function findFrameByName(win, name) {

    var frame = void 0;

    frame = getFrameByName(win, name);

    if (frame) {
        return frame;
    }

    return findChildFrameByName(getTop(win), name);
}

function isParent(win, frame) {

    var frameParent = getParent(frame);

    if (frameParent) {
        return frameParent === win;
    }

    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
        for (var _iterator8 = getFrames(win)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var childFrame = _step8.value;

            if (childFrame === frame) {
                return true;
            }
        }
    } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion8 && _iterator8['return']) {
                _iterator8['return']();
            }
        } finally {
            if (_didIteratorError8) {
                throw _iteratorError8;
            }
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

    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
        for (var _iterator9 = getFrames(parent)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var frame = _step9.value;

            if (frame === child) {
                return true;
            }
        }
    } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion9 && _iterator9['return']) {
                _iterator9['return']();
            }
        } finally {
            if (_didIteratorError9) {
                throw _iteratorError9;
            }
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
    var _iteratorNormalCompletion10 = true;
    var _didIteratorError10 = false;
    var _iteratorError10 = undefined;

    try {

        for (var _iterator10 = collection1[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
            var item1 = _step10.value;
            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
                for (var _iterator11 = collection2[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                    var item2 = _step11.value;

                    if (item1 === item2) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError11 = true;
                _iteratorError11 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion11 && _iterator11['return']) {
                        _iterator11['return']();
                    }
                } finally {
                    if (_didIteratorError11) {
                        throw _iteratorError11;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion10 && _iterator10['return']) {
                _iterator10['return']();
            }
        } finally {
            if (_didIteratorError10) {
                throw _iteratorError10;
            }
        }
    }
}

function getDistanceFromTop() {
    var win = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

    var distance = 0;

    while (win) {
        win = getParent(win);
        if (win) {
            distance += 1;
        }
    }

    return distance;
}

function getNthParent(win) {
    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    for (var i = 0; i < n; i++) {
        win = getParent(win);
    }
    return win;
}

function getNthParentFromTop(win) {
    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    return getNthParent(win, getDistanceFromTop(win) - n);
}

function isSameTopWindow(win1, win2) {

    var top1 = getTop(win1);
    var top2 = getTop(win2);

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

/***/ }),

/***/ "./src/util.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isRegex = isRegex;
function isRegex(item) {
    return Object.prototype.toString.call(item) === '[object RegExp]';
}

/***/ })

/******/ });
});
//# sourceMappingURL=cross-domain-utils.js.map