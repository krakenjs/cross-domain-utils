/* @flow */

export function isRegex(item : mixed) : boolean {
    // $FlowFixMe method-unbinding
    return Object.prototype.toString.call(item) === '[object RegExp]';
}

// eslint-disable-next-line no-unused-vars
export function noop(...args : $ReadOnlyArray<mixed>) {
    // pass
}
