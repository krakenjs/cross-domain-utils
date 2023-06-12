export function isRegex(item) {
  return Object.prototype.toString.call(item) === "[object RegExp]";
}
export function noop() {}