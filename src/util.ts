export function isRegex(item: unknown): boolean {
  return Object.prototype.toString.call(item) === "[object RegExp]";
}

export function noop(...args: ReadonlyArray<unknown>): void {
  // pass
}
