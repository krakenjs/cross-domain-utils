// @flow

export function isRegex(item : any) {
    return Object.prototype.toString.call(item) === '[object RegExp]';
}

export function noop(...args : Array<mixed>) {
    // pass
}
