!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define("crossDomainUtils", [], factory) : "object" == typeof exports ? exports.crossDomainUtils = factory() : root.crossDomainUtils = factory();
}("undefined" != typeof self ? self : this, function() {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: !1,
                exports: {}
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.l = !0;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                configurable: !1,
                enumerable: !0,
                get: getter
            });
        };
        __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function() {
                return module.default;
            } : function() {
                return module;
            };
            __webpack_require__.d(getter, "a", getter);
            return getter;
        };
        __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = "./src/index.js");
    }({
        "./src/index.js": function(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            Object.defineProperty(__webpack_exports__, "__esModule", {
                value: !0
            });
            function isRegex(item) {
                return "[object RegExp]" === Object.prototype.toString.call(item);
            }
            var PROTOCOL = {
                MOCK: "mock:",
                FILE: "file:",
                ABOUT: "about:"
            }, WILDCARD = "*", WINDOW_TYPE = {
                IFRAME: "iframe",
                POPUP: "popup"
            }, IE_WIN_ACCESS_ERROR = "Call was rejected by callee.\r\n";
            function isFileProtocol() {
                return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window).location.protocol === PROTOCOL.FILE;
            }
            function isAboutProtocol() {
                return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window).location.protocol === PROTOCOL.ABOUT;
            }
            function getParent() {
                var win = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window;
                if (win) try {
                    if (win.parent && win.parent !== win) return win.parent;
                } catch (err) {}
            }
            function getOpener() {
                var win = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window;
                if (win && !getParent(win)) try {
                    return win.opener;
                } catch (err) {}
            }
            function canReadFromWindow(win) {
                try {
                    win && win.location && win.location.href;
                    return !0;
                } catch (err) {}
                return !1;
            }
            function getActualDomain() {
                var win = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window, location = win.location;
                if (!location) throw new Error("Can not read window location");
                var protocol = location.protocol;
                if (!protocol) throw new Error("Can not read window protocol");
                if (protocol === PROTOCOL.FILE) return PROTOCOL.FILE + "//";
                if (protocol === PROTOCOL.ABOUT) {
                    var parent = getParent(win);
                    return parent && canReadFromWindow(parent) ? getActualDomain(parent) : PROTOCOL.ABOUT + "//";
                }
                var host = location.host;
                if (!host) throw new Error("Can not read window host");
                return protocol + "//" + host;
            }
            function getDomain() {
                var win = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window, domain = getActualDomain(win);
                return domain && win.mockDomain && 0 === win.mockDomain.indexOf(PROTOCOL.MOCK) ? win.mockDomain : domain;
            }
            function isBlankDomain(win) {
                try {
                    if (!win.location.href) return !0;
                    if ("about:blank" === win.location.href) return !0;
                } catch (err) {}
                return !1;
            }
            function isActuallySameDomain(win) {
                try {
                    if (win === window) return !0;
                } catch (err) {}
                try {
                    var desc = Object.getOwnPropertyDescriptor(win, "location");
                    if (desc && !1 === desc.enumerable) return !1;
                } catch (err) {}
                try {
                    if (isAboutProtocol(win) && canReadFromWindow(win)) return !0;
                } catch (err) {}
                try {
                    if (getActualDomain(win) === getActualDomain(window)) return !0;
                } catch (err) {}
                return !1;
            }
            function isSameDomain(win) {
                if (!isActuallySameDomain(win)) return !1;
                try {
                    if (win === window) return !0;
                    if (isAboutProtocol(win) && canReadFromWindow(win)) return !0;
                    if (getDomain(window) === getDomain(win)) return !0;
                } catch (err) {}
                return !1;
            }
            function assertSameDomain(win) {
                if (!isSameDomain(win)) throw new Error("Expected window to be same domain");
                return win;
            }
            function getParents(win) {
                var result = [];
                try {
                    for (;win.parent !== win; ) {
                        result.push(win.parent);
                        win = win.parent;
                    }
                } catch (err) {}
                return result;
            }
            function isAncestorParent(parent, child) {
                if (!parent || !child) return !1;
                var childParent = getParent(child);
                return childParent ? childParent === parent : -1 !== getParents(child).indexOf(parent);
            }
            function getFrames(win) {
                var result = [], frames = void 0;
                try {
                    frames = win.frames;
                } catch (err) {
                    frames = win;
                }
                var len = void 0;
                try {
                    len = frames.length;
                } catch (err) {}
                if (0 === len) return result;
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
                    if (!_frame) return result;
                    result.push(_frame);
                }
                return result;
            }
            function getAllChildFrames(win) {
                for (var result = [], _i3 = 0, _getFrames2 = getFrames(win), _length2 = null == _getFrames2 ? 0 : _getFrames2.length; _i3 < _length2; _i3++) {
                    var frame = _getFrames2[_i3];
                    result.push(frame);
                    for (var _i5 = 0, _getAllChildFrames2 = getAllChildFrames(frame), _length4 = null == _getAllChildFrames2 ? 0 : _getAllChildFrames2.length; _i5 < _length4; _i5++) {
                        var childFrame = _getAllChildFrames2[_i5];
                        result.push(childFrame);
                    }
                }
                return result;
            }
            function getTop() {
                var win = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window;
                try {
                    if (win.top) return win.top;
                } catch (err) {}
                if (getParent(win) === win) return win;
                try {
                    if (isAncestorParent(window, win) && window.top) return window.top;
                } catch (err) {}
                try {
                    if (isAncestorParent(win, window) && window.top) return window.top;
                } catch (err) {}
                for (var _i7 = 0, _getAllChildFrames4 = getAllChildFrames(win), _length6 = null == _getAllChildFrames4 ? 0 : _getAllChildFrames4.length; _i7 < _length6; _i7++) {
                    var frame = _getAllChildFrames4[_i7];
                    try {
                        if (frame.top) return frame.top;
                    } catch (err) {}
                    if (getParent(frame) === frame) return frame;
                }
            }
            function getNextOpener() {
                var win = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window;
                return getOpener(getTop(win) || win);
            }
            function getUltimateTop() {
                var opener = getNextOpener(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window);
                return opener ? getUltimateTop(opener) : top;
            }
            function getAllFramesInWindow(win) {
                var top = getTop(win);
                if (!top) throw new Error("Can not determine top window");
                return [].concat(getAllChildFrames(top), [ top ]);
            }
            function getAllWindows() {
                var win = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window, frames = getAllFramesInWindow(win), opener = getNextOpener(win);
                return opener ? [].concat(getAllWindows(opener), frames) : frames;
            }
            function isTop(win) {
                return win === getTop(win);
            }
            function isFrameWindowClosed(frame) {
                if (!frame.contentWindow) return !0;
                if (!frame.parentNode) return !0;
                var doc = frame.ownerDocument;
                return !(!doc || !doc.documentElement || doc.documentElement.contains(frame));
            }
            var iframeWindows = [], iframeFrames = [];
            function isWindowClosed(win) {
                var allowMock = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                try {
                    if (win === window) return !1;
                } catch (err) {
                    return !0;
                }
                try {
                    if (!win) return !0;
                } catch (err) {
                    return !0;
                }
                try {
                    if (win.closed) return !0;
                } catch (err) {
                    return !err || err.message !== IE_WIN_ACCESS_ERROR;
                }
                if (allowMock && isSameDomain(win)) try {
                    if (win.mockclosed) return !0;
                } catch (err) {}
                try {
                    if (!win.parent || !win.top) return !0;
                } catch (err) {}
                var iframeIndex = function(collection, item) {
                    for (var i = 0; i < collection.length; i++) try {
                        if (collection[i] === item) return i;
                    } catch (err) {}
                    return -1;
                }(iframeWindows, win);
                if (-1 !== iframeIndex) {
                    var frame = iframeFrames[iframeIndex];
                    if (frame && isFrameWindowClosed(frame)) return !0;
                }
                return !1;
            }
            function linkFrameWindow(frame) {
                !function() {
                    for (var i = 0; i < iframeWindows.length; i++) {
                        var closed = !1;
                        try {
                            closed = iframeWindows[i].closed;
                        } catch (err) {}
                        if (closed) {
                            iframeFrames.splice(i, 1);
                            iframeWindows.splice(i, 1);
                        }
                    }
                }();
                if (frame && frame.contentWindow) try {
                    iframeWindows.push(frame.contentWindow);
                    iframeFrames.push(frame);
                } catch (err) {}
            }
            function getUserAgent(win) {
                return (win = win || window).navigator.mockUserAgent || win.navigator.userAgent;
            }
            function getFrameByName(win, name) {
                for (var winFrames = getFrames(win), _i9 = 0, _length8 = null == winFrames ? 0 : winFrames.length; _i9 < _length8; _i9++) {
                    var childFrame = winFrames[_i9];
                    try {
                        if (isSameDomain(childFrame) && childFrame.name === name && -1 !== winFrames.indexOf(childFrame)) return childFrame;
                    } catch (err) {}
                }
                try {
                    if (-1 !== winFrames.indexOf(win.frames[name])) return win.frames[name];
                } catch (err) {}
                try {
                    if (-1 !== winFrames.indexOf(win[name])) return win[name];
                } catch (err) {}
            }
            function findChildFrameByName(win, name) {
                var frame = getFrameByName(win, name);
                if (frame) return frame;
                for (var _i11 = 0, _getFrames4 = getFrames(win), _length10 = null == _getFrames4 ? 0 : _getFrames4.length; _i11 < _length10; _i11++) {
                    var namedFrame = findChildFrameByName(_getFrames4[_i11], name);
                    if (namedFrame) return namedFrame;
                }
            }
            function findFrameByName(win, name) {
                var frame;
                return (frame = getFrameByName(win, name)) ? frame : findChildFrameByName(getTop(win) || win, name);
            }
            function isParent(win, frame) {
                var frameParent = getParent(frame);
                if (frameParent) return frameParent === win;
                for (var _i13 = 0, _getFrames6 = getFrames(win), _length12 = null == _getFrames6 ? 0 : _getFrames6.length; _i13 < _length12; _i13++) if (_getFrames6[_i13] === frame) return !0;
                return !1;
            }
            function isOpener(parent, child) {
                return parent === getOpener(child);
            }
            function getAncestor() {
                var win = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window;
                return getOpener(win = win || window) || getParent(win) || void 0;
            }
            function getAncestors(win) {
                for (var results = [], ancestor = win; ancestor; ) (ancestor = getAncestor(ancestor)) && results.push(ancestor);
                return results;
            }
            function isAncestor(parent, child) {
                var actualParent = getAncestor(child);
                if (actualParent) return actualParent === parent;
                if (child === parent) return !1;
                if (getTop(child) === child) return !1;
                for (var _i15 = 0, _getFrames8 = getFrames(parent), _length14 = null == _getFrames8 ? 0 : _getFrames8.length; _i15 < _length14; _i15++) if (_getFrames8[_i15] === child) return !0;
                return !1;
            }
            function isPopup() {
                var win = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window;
                return Boolean(getOpener(win));
            }
            function isIframe() {
                var win = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window;
                return Boolean(getParent(win));
            }
            function isFullpage() {
                var win = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window;
                return Boolean(!isIframe(win) && !isPopup(win));
            }
            function anyMatch(collection1, collection2) {
                for (var _i17 = 0, _length16 = null == collection1 ? 0 : collection1.length; _i17 < _length16; _i17++) for (var item1 = collection1[_i17], _i19 = 0, _length18 = null == collection2 ? 0 : collection2.length; _i19 < _length18; _i19++) if (item1 === collection2[_i19]) return !0;
                return !1;
            }
            function getDistanceFromTop() {
                for (var distance = 0, parent = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window; parent; ) (parent = getParent(parent)) && (distance += 1);
                return distance;
            }
            function getNthParent(win) {
                for (var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, parent = win, i = 0; i < n; i++) {
                    if (!parent) return;
                    parent = getParent(parent);
                }
                return parent;
            }
            function getNthParentFromTop(win) {
                var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
                return getNthParent(win, getDistanceFromTop(win) - n);
            }
            function isSameTopWindow(win1, win2) {
                var top1 = getTop(win1) || win1, top2 = getTop(win2) || win2;
                try {
                    if (top1 && top2) return top1 === top2;
                } catch (err) {}
                var allFrames1 = getAllFramesInWindow(win1), allFrames2 = getAllFramesInWindow(win2);
                if (anyMatch(allFrames1, allFrames2)) return !0;
                var opener1 = getOpener(top1), opener2 = getOpener(top2);
                return !(opener1 && anyMatch(getAllFramesInWindow(opener1), allFrames2) || (opener2 && anyMatch(getAllFramesInWindow(opener2), allFrames1), 
                1));
            }
            function matchDomain(pattern, origin) {
                if ("string" == typeof pattern) {
                    if ("string" == typeof origin) return pattern === WILDCARD || origin === pattern;
                    if (isRegex(origin)) return !1;
                    if (Array.isArray(origin)) return !1;
                }
                return isRegex(pattern) ? isRegex(origin) ? pattern.toString() === origin.toString() : !Array.isArray(origin) && Boolean(origin.match(pattern)) : !!Array.isArray(pattern) && (Array.isArray(origin) ? JSON.stringify(pattern) === JSON.stringify(origin) : !isRegex(origin) && pattern.some(function(subpattern) {
                    return matchDomain(subpattern, origin);
                }));
            }
            function stringifyDomainPattern(pattern) {
                return Array.isArray(pattern) ? "(" + pattern.join(" | ") + ")" : isRegex(pattern) ? "RegExp(" + pattern.toString() : pattern.toString();
            }
            function getDomainFromUrl(url) {
                return url.match(/^(https?|mock|file):\/\//) ? url.split("/").slice(0, 3).join("/") : getDomain();
            }
            function onCloseWindow(win, callback) {
                var delay = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1e3, maxtime = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1 / 0, timeout = void 0;
                !function check() {
                    if (isWindowClosed(win)) {
                        timeout && clearTimeout(timeout);
                        return callback();
                    }
                    if (maxtime <= 0) clearTimeout(timeout); else {
                        maxtime -= delay;
                        timeout = setTimeout(check, delay);
                    }
                }();
                return {
                    cancel: function() {
                        timeout && clearTimeout(timeout);
                    }
                };
            }
            function isWindow(obj) {
                try {
                    if (obj === window) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if ("[object Window]" === Object.prototype.toString.call(obj)) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if (window.Window && obj instanceof window.Window) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if (obj && obj.self === obj) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if (obj && obj.parent === obj) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if (obj && obj.top === obj) return !0;
                } catch (err) {
                    if (err && err.message === IE_WIN_ACCESS_ERROR) return !0;
                }
                try {
                    if (obj && "__unlikely_value__" === obj.__cross_domain_utils_window_check__) return !1;
                } catch (err) {
                    return !0;
                }
                return !1;
            }
            function isBrowser() {
                return "undefined" != typeof window && void 0 !== window.location;
            }
            function isCurrentDomain(domain) {
                return !!isBrowser() && getDomain() === domain;
            }
            function isMockDomain(domain) {
                return 0 === domain.indexOf(PROTOCOL.MOCK);
            }
            function normalizeMockUrl(url) {
                if (!isMockDomain(getDomainFromUrl(url))) return url;
                throw new Error("Mock urls not supported out of test mode");
            }
            function closeWindow(win) {
                try {
                    win.close();
                } catch (err) {}
            }
            function getFrameForWindow(win) {
                if (isSameDomain(win)) return assertSameDomain(win).frameElement;
                for (var _i21 = 0, _document$querySelect2 = document.querySelectorAll("iframe"), _length20 = null == _document$querySelect2 ? 0 : _document$querySelect2.length; _i21 < _length20; _i21++) {
                    var frame = _document$querySelect2[_i21];
                    if (frame && frame.contentWindow && frame.contentWindow === win) return frame;
                }
            }
            __webpack_require__.d(__webpack_exports__, "isFileProtocol", function() {
                return isFileProtocol;
            });
            __webpack_require__.d(__webpack_exports__, "isAboutProtocol", function() {
                return isAboutProtocol;
            });
            __webpack_require__.d(__webpack_exports__, "getParent", function() {
                return getParent;
            });
            __webpack_require__.d(__webpack_exports__, "getOpener", function() {
                return getOpener;
            });
            __webpack_require__.d(__webpack_exports__, "canReadFromWindow", function() {
                return canReadFromWindow;
            });
            __webpack_require__.d(__webpack_exports__, "getActualDomain", function() {
                return getActualDomain;
            });
            __webpack_require__.d(__webpack_exports__, "getDomain", function() {
                return getDomain;
            });
            __webpack_require__.d(__webpack_exports__, "isBlankDomain", function() {
                return isBlankDomain;
            });
            __webpack_require__.d(__webpack_exports__, "isActuallySameDomain", function() {
                return isActuallySameDomain;
            });
            __webpack_require__.d(__webpack_exports__, "isSameDomain", function() {
                return isSameDomain;
            });
            __webpack_require__.d(__webpack_exports__, "assertSameDomain", function() {
                return assertSameDomain;
            });
            __webpack_require__.d(__webpack_exports__, "getParents", function() {
                return getParents;
            });
            __webpack_require__.d(__webpack_exports__, "isAncestorParent", function() {
                return isAncestorParent;
            });
            __webpack_require__.d(__webpack_exports__, "getFrames", function() {
                return getFrames;
            });
            __webpack_require__.d(__webpack_exports__, "getAllChildFrames", function() {
                return getAllChildFrames;
            });
            __webpack_require__.d(__webpack_exports__, "getTop", function() {
                return getTop;
            });
            __webpack_require__.d(__webpack_exports__, "getNextOpener", function() {
                return getNextOpener;
            });
            __webpack_require__.d(__webpack_exports__, "getUltimateTop", function() {
                return getUltimateTop;
            });
            __webpack_require__.d(__webpack_exports__, "getAllFramesInWindow", function() {
                return getAllFramesInWindow;
            });
            __webpack_require__.d(__webpack_exports__, "getAllWindows", function() {
                return getAllWindows;
            });
            __webpack_require__.d(__webpack_exports__, "isTop", function() {
                return isTop;
            });
            __webpack_require__.d(__webpack_exports__, "isFrameWindowClosed", function() {
                return isFrameWindowClosed;
            });
            __webpack_require__.d(__webpack_exports__, "isWindowClosed", function() {
                return isWindowClosed;
            });
            __webpack_require__.d(__webpack_exports__, "linkFrameWindow", function() {
                return linkFrameWindow;
            });
            __webpack_require__.d(__webpack_exports__, "getUserAgent", function() {
                return getUserAgent;
            });
            __webpack_require__.d(__webpack_exports__, "getFrameByName", function() {
                return getFrameByName;
            });
            __webpack_require__.d(__webpack_exports__, "findChildFrameByName", function() {
                return findChildFrameByName;
            });
            __webpack_require__.d(__webpack_exports__, "findFrameByName", function() {
                return findFrameByName;
            });
            __webpack_require__.d(__webpack_exports__, "isParent", function() {
                return isParent;
            });
            __webpack_require__.d(__webpack_exports__, "isOpener", function() {
                return isOpener;
            });
            __webpack_require__.d(__webpack_exports__, "getAncestor", function() {
                return getAncestor;
            });
            __webpack_require__.d(__webpack_exports__, "getAncestors", function() {
                return getAncestors;
            });
            __webpack_require__.d(__webpack_exports__, "isAncestor", function() {
                return isAncestor;
            });
            __webpack_require__.d(__webpack_exports__, "isPopup", function() {
                return isPopup;
            });
            __webpack_require__.d(__webpack_exports__, "isIframe", function() {
                return isIframe;
            });
            __webpack_require__.d(__webpack_exports__, "isFullpage", function() {
                return isFullpage;
            });
            __webpack_require__.d(__webpack_exports__, "getDistanceFromTop", function() {
                return getDistanceFromTop;
            });
            __webpack_require__.d(__webpack_exports__, "getNthParent", function() {
                return getNthParent;
            });
            __webpack_require__.d(__webpack_exports__, "getNthParentFromTop", function() {
                return getNthParentFromTop;
            });
            __webpack_require__.d(__webpack_exports__, "isSameTopWindow", function() {
                return isSameTopWindow;
            });
            __webpack_require__.d(__webpack_exports__, "matchDomain", function() {
                return matchDomain;
            });
            __webpack_require__.d(__webpack_exports__, "stringifyDomainPattern", function() {
                return stringifyDomainPattern;
            });
            __webpack_require__.d(__webpack_exports__, "getDomainFromUrl", function() {
                return getDomainFromUrl;
            });
            __webpack_require__.d(__webpack_exports__, "onCloseWindow", function() {
                return onCloseWindow;
            });
            __webpack_require__.d(__webpack_exports__, "isWindow", function() {
                return isWindow;
            });
            __webpack_require__.d(__webpack_exports__, "isBrowser", function() {
                return isBrowser;
            });
            __webpack_require__.d(__webpack_exports__, "isCurrentDomain", function() {
                return isCurrentDomain;
            });
            __webpack_require__.d(__webpack_exports__, "isMockDomain", function() {
                return isMockDomain;
            });
            __webpack_require__.d(__webpack_exports__, "normalizeMockUrl", function() {
                return normalizeMockUrl;
            });
            __webpack_require__.d(__webpack_exports__, "closeWindow", function() {
                return closeWindow;
            });
            __webpack_require__.d(__webpack_exports__, "getFrameForWindow", function() {
                return getFrameForWindow;
            });
            __webpack_require__.d(__webpack_exports__, "TYPES", function() {
                return !0;
            });
            __webpack_require__.d(__webpack_exports__, "PROTOCOL", function() {
                return PROTOCOL;
            });
            __webpack_require__.d(__webpack_exports__, "WILDCARD", function() {
                return WILDCARD;
            });
            __webpack_require__.d(__webpack_exports__, "WINDOW_TYPE", function() {
                return WINDOW_TYPE;
            });
        }
    });
});
//# sourceMappingURL=cross-domain-utils.js.map