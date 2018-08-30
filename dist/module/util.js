export function isRegex(item) {
    return Object.prototype.toString.call(item) === '[object RegExp]';
}

// eslint-disable-next-line no-unused-vars
export function noop() {
    // pass
}