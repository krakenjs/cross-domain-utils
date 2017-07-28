'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isRegex = isRegex;
function isRegex(item) {
    return Object.prototype.toString.call(item) === '[object RegExp]';
}