export function isRegex(item : unknown) : boolean {
    return Object.prototype.toString.call(item) === '[object RegExp]';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function noop(...args : ReadonlyArray<unknown>) : void {
    // pass
}
