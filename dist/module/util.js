'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isRegex = isRegex;
exports.noop = noop;
function isRegex(item) {
    return Object.prototype.toString.call(item) === '[object RegExp]';
}

// eslint-disable-next-line no-unused-vars
function noop() {
    // pass
}