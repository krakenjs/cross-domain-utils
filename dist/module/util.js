export function isRegex(item) {
  // $FlowFixMe method-unbinding
  return Object.prototype.toString.call(item) === '[object RegExp]';
} // eslint-disable-next-line no-unused-vars

export function noop() {// pass
}