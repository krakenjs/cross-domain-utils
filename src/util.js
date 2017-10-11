// @flow

export function isRegex(item : mixed) : boolean {
    return Object.prototype.toString.call(item) === '[object RegExp]';
}

export function noop(...args : Array<mixed>) {
    // pass
}
