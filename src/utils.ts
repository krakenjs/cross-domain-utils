/* eslint max-lines: 0, @typescript-eslint/prefer-optional-chain: 0 */
/* global NodeJS */
import { isRegex, noop } from "./util";
import type {
  CrossDomainWindowType,
  SameDomainWindowType,
  DomainMatcher,
} from "./types";
import { PROTOCOL, WILDCARD } from "./constants";

const IE_WIN_ACCESS_ERROR = "Call was rejected by callee.\r\n";

export function getActualProtocol(win: SameDomainWindowType = window): string {
  return win.location.protocol;
}

export function getProtocol(win: SameDomainWindowType = window): string {
  // @ts-ignore mockDomain does not exist on window
  if (win.mockDomain) {
    // @ts-ignore mockDomain does not exist on window
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const protocol = win.mockDomain.split("//")[0];

    if (protocol) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return protocol;
    }
  }

  return getActualProtocol(win);
}

export function isFileProtocol(win: SameDomainWindowType = window): boolean {
  return getProtocol(win) === PROTOCOL.FILE;
}

export function isAboutProtocol(win: SameDomainWindowType = window): boolean {
  return getProtocol(win) === PROTOCOL.ABOUT;
}

export function isMockProtocol(win: SameDomainWindowType = window): boolean {
  return getProtocol(win) === PROTOCOL.MOCK;
}

export function getParent(
  win: CrossDomainWindowType = window
): CrossDomainWindowType | null | undefined {
  if (!win) {
    return;
  }

  try {
    if (win.parent && win.parent !== win) {
      return win.parent;
    }
  } catch (err: unknown) {
    // pass
  }
}

export function getOpener(
  win: CrossDomainWindowType = window
): CrossDomainWindowType | null | undefined {
  if (!win) {
    return;
  }

  // Make sure we're not actually an iframe which has had window.open() called on us
  if (getParent(win)) {
    return;
  }

  try {
    return win.opener as CrossDomainWindowType;
  } catch (err: unknown) {
    // pass
  }
}

export function canReadFromWindow(
  win: CrossDomainWindowType | SameDomainWindowType
): boolean {
  try {
    noop(win && win.location && win.location.href);
    return true;
  } catch (err: unknown) {
    // pass
  }

  return false;
}

export function getActualDomain(win: SameDomainWindowType = window): string {
  const location = win.location;

  if (!location) {
    throw new Error(`Can not read window location`);
  }

  const protocol = getActualProtocol(win);

  if (!protocol) {
    throw new Error(`Can not read window protocol`);
  }

  if (protocol === PROTOCOL.FILE) {
    return `${PROTOCOL.FILE}//`;
  }

  if (protocol === PROTOCOL.ABOUT) {
    // @ts-ignore - trying to reassing to something that might be window
    const parent = getParent(win);

    if (parent && canReadFromWindow(parent)) {
      // @ts-ignore
      return getActualDomain(parent);
    }

    return `${PROTOCOL.ABOUT}//`;
  }

  const host = location.host;

  if (!host) {
    throw new Error(`Can not read window host`);
  }

  return `${protocol}//${host}`;
}

export function getDomain(win: SameDomainWindowType = window): string {
  const domain = getActualDomain(win);

  if (
    domain &&
    // @ts-ignore - mockDomain
    win.mockDomain &&
    // @ts-ignore - mockDomain
    (win.mockDomain as string).indexOf(PROTOCOL.MOCK) === 0
  ) {
    // @ts-ignore - mockDomain
    return win.mockDomain as string;
  }

  return domain;
}

export function isBlankDomain(win: CrossDomainWindowType): boolean {
  try {
    if (!win.location.href) {
      return true;
    }

    if (win.location.href === "about:blank") {
      return true;
    }
  } catch (err: unknown) {
    // pass
  }

  return false;
}

export function isActuallySameDomain(
  win: CrossDomainWindowType | SameDomainWindowType
): boolean {
  try {
    if (win === window) {
      return true;
    }
  } catch (err: unknown) {
    // pass
  }

  try {
    const desc = Object.getOwnPropertyDescriptor(win, "location");

    if (desc && desc.enumerable === false) {
      return false;
    }
  } catch (err: unknown) {
    // pass
  }

  try {
    if (isAboutProtocol(win) && canReadFromWindow(win)) {
      return true;
    }
  } catch (err: unknown) {
    // pass
  }

  try {
    if (isMockProtocol(win) && canReadFromWindow(win)) {
      return true;
    }
  } catch (err) {
    // pass
  }

  try {
    if (getActualDomain(win) === getActualDomain(window)) {
      return true;
    }
  } catch (err: unknown) {
    // pass
  }

  return false;
}

export function isSameDomain(
  win: CrossDomainWindowType | SameDomainWindowType
): boolean {
  if (!isActuallySameDomain(win)) {
    return false;
  }

  try {
    if (win === window) {
      return true;
    }

    if (isAboutProtocol(win) && canReadFromWindow(win)) {
      return true;
    }

    if (getDomain(window) === getDomain(win)) {
      return true;
    }
  } catch (err: unknown) {
    // pass
  }

  return false;
}

export function assertSameDomain(
  win: CrossDomainWindowType | SameDomainWindowType
): SameDomainWindowType {
  if (!isSameDomain(win)) {
    throw new Error(`Expected window to be same domain`);
  }

  return win;
}

export function getParents(
  win: CrossDomainWindowType
): ReadonlyArray<CrossDomainWindowType> {
  const result = [];

  try {
    while (win.parent !== win) {
      result.push(win.parent);
      win = win.parent;
    }
  } catch (err: unknown) {
    // pass
  }

  return result;
}

export function isAncestorParent(
  parent: CrossDomainWindowType,
  child: CrossDomainWindowType
): boolean {
  if (!parent || !child) {
    return false;
  }

  const childParent = getParent(child);

  if (childParent) {
    return childParent === parent;
  }

  if (getParents(child).indexOf(parent) !== -1) {
    return true;
  }

  return false;
}

export function getFrames(
  win: CrossDomainWindowType
): Array<CrossDomainWindowType> {
  const result: Array<CrossDomainWindowType> = [];
  let frames;

  try {
    frames = win.frames;
  } catch (err: unknown) {
    frames = win;
  }

  let len;

  try {
    len = frames.length;
  } catch (err: unknown) {
    // pass
  }

  if (len === 0) {
    return result;
  }

  if (len) {
    for (let i = 0; i < len; i++) {
      let frame;

      try {
        frame = frames[i];
      } catch (err: unknown) {
        continue;
      }

      result.push(frame);
    }

    return result;
  }

  for (let i = 0; i < 100; i++) {
    let frame;

    try {
      frame = frames[i];
    } catch (err: unknown) {
      return result;
    }

    if (!frame) {
      return result;
    }

    result.push(frame);
  }

  return result;
}

export function getAllChildFrames(
  win: CrossDomainWindowType
): ReadonlyArray<CrossDomainWindowType> {
  const result = [];

  for (const frame of getFrames(win)) {
    result.push(frame);

    for (const childFrame of getAllChildFrames(frame)) {
      result.push(childFrame);
    }
  }

  return result;
}

export function getTop(
  win: CrossDomainWindowType = window
): CrossDomainWindowType | null | undefined {
  try {
    if (win.top) {
      return win.top;
    }
  } catch (err: unknown) {
    // pass
  }

  if (getParent(win) === win) {
    return win;
  }

  try {
    if (isAncestorParent(window, win) && window.top) {
      return window.top;
    }
  } catch (err: unknown) {
    // pass
  }

  try {
    if (isAncestorParent(win, window) && window.top) {
      return window.top;
    }
  } catch (err: unknown) {
    // pass
  }

  for (const frame of getAllChildFrames(win)) {
    try {
      if (frame.top) {
        return frame.top;
      }
    } catch (err: unknown) {
      // pass
    }

    if (getParent(frame) === frame) {
      return frame;
    }
  }
}

export function getNextOpener(
  win: CrossDomainWindowType = window
): CrossDomainWindowType | null | undefined {
  return getOpener(getTop(win) || win);
}

export function getUltimateTop(
  win: CrossDomainWindowType = window
): CrossDomainWindowType | null {
  const opener = getNextOpener(win);

  if (opener) {
    return getUltimateTop(opener);
  }

  return top;
}

export function getAllFramesInWindow(
  win: CrossDomainWindowType
): ReadonlyArray<CrossDomainWindowType> {
  const top = getTop(win);

  if (!top) {
    throw new Error(`Can not determine top window`);
  }

  let result = [...getAllChildFrames(top), top];

  // Win may be in shadow dom
  if (result.indexOf(win) === -1) {
    result = [...result, win, ...getAllChildFrames(win)];
  }

  return result;
}

export function getAllWindows(
  win: CrossDomainWindowType = window
): ReadonlyArray<CrossDomainWindowType> {
  const frames = getAllFramesInWindow(win);
  const opener = getNextOpener(win);

  if (opener) {
    return [...getAllWindows(opener), ...frames];
  } else {
    return frames;
  }
}

export function isTop(win: CrossDomainWindowType): boolean {
  return win === getTop(win);
}

export function isFrameWindowClosed(frame: HTMLIFrameElement): boolean {
  if (!frame.contentWindow) {
    return true;
  }

  if (!frame.parentNode) {
    return true;
  }

  const doc = frame.ownerDocument;

  if (doc && doc.documentElement && !doc.documentElement.contains(frame)) {
    let parent = frame;

    while (parent.parentNode && parent.parentNode !== parent) {
      // @ts-ignore
      parent = parent.parentNode;
    }

    // @ts-ignore - host does not exist on type frame
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (!parent.host || !doc.documentElement.contains(parent.host)) {
      return true;
    }
  }

  return false;
}

function safeIndexOf<T>(collection: ReadonlyArray<T>, item: T): number {
  for (let i = 0; i < collection.length; i++) {
    try {
      if (collection[i] === item) {
        return i;
      }
    } catch (err: unknown) {
      // pass
    }
  }

  return -1;
}

const iframeWindows: Array<CrossDomainWindowType> = [];
const iframeFrames: Array<HTMLIFrameElement> = [];

export function isWindowClosed(
  win: CrossDomainWindowType,
  allowMock = true
): boolean {
  try {
    if (win === window) {
      return false;
    }
  } catch (err: unknown) {
    return true;
  }

  try {
    if (!win) {
      return true;
    }
  } catch (err: unknown) {
    return true;
  }

  try {
    if (win.closed) {
      return true;
    }
  } catch (err: unknown) {
    // I love you so much IE
    if (err && (err as Error).message === IE_WIN_ACCESS_ERROR) {
      return false;
    }

    return true;
  }

  if (allowMock && isSameDomain(win)) {
    try {
      // @ts-ignore
      if (win.mockclosed) {
        return true;
      }
    } catch (err: unknown) {
      // pass
    }
  }

  // Mobile safari
  try {
    if (!win.parent || !win.top) {
      return true;
    }
  } catch (err: unknown) {
    // pass
  }

  // Yes, this actually happens in IE. win === win errors out when the window
  // is from an iframe, and the iframe was removed from the page.
  try {
    noop(win === win); // eslint-disable-line no-self-compare
  } catch (err: unknown) {
    return true;
  }

  // IE orphaned frame
  const iframeIndex = safeIndexOf(iframeWindows, win);

  if (iframeIndex !== -1) {
    const frame = iframeFrames[iframeIndex];

    if (frame && isFrameWindowClosed(frame)) {
      return true;
    }
  }

  return false;
}

function cleanIframes(): void {
  for (let i = 0; i < iframeWindows.length; i++) {
    let closed = false;

    try {
      closed = iframeWindows[i].closed;
    } catch (err: unknown) {
      // pass
    }

    if (closed) {
      iframeFrames.splice(i, 1);
      iframeWindows.splice(i, 1);
    }
  }
}

export function linkFrameWindow(frame: HTMLIFrameElement): void {
  cleanIframes();

  if (frame && frame.contentWindow) {
    try {
      iframeWindows.push(frame.contentWindow);
      iframeFrames.push(frame);
    } catch (err: unknown) {
      // pass
    }
  }
}

export function getUserAgent(
  win: SameDomainWindowType | null | undefined
): string {
  win = win || window;
  // @ts-ignore
  return (win.navigator.mockUserAgent as string) || win.navigator.userAgent;
}

export function getFrameByName(
  win: CrossDomainWindowType,
  name: string
): CrossDomainWindowType | null | undefined {
  const winFrames = getFrames(win);

  for (const childFrame of winFrames) {
    try {
      if (
        isSameDomain(childFrame) &&
        childFrame.name === name &&
        winFrames.indexOf(childFrame) !== -1
      ) {
        return childFrame;
      }
    } catch (err: unknown) {
      // pass
    }
  }

  try {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (winFrames.indexOf(win.frames[name]) !== -1) {
      // @ts-ignore
      return win.frames[name] as CrossDomainWindowType;
    }
  } catch (err: unknown) {
    // pass
  }

  try {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (winFrames.indexOf(win[name]) !== -1) {
      // @ts-ignore
      return win[name] as CrossDomainWindowType;
    }
  } catch (err: unknown) {
    // pass
  }
}

export function findChildFrameByName(
  win: CrossDomainWindowType,
  name: string
): CrossDomainWindowType | null | undefined {
  const frame = getFrameByName(win, name);

  if (frame) {
    return frame;
  }

  for (const childFrame of getFrames(win)) {
    const namedFrame = findChildFrameByName(childFrame, name);

    if (namedFrame) {
      return namedFrame;
    }
  }
}

export function findFrameByName(
  win: CrossDomainWindowType,
  name: string
): CrossDomainWindowType | null | undefined {
  const frame = getFrameByName(win, name);

  if (frame) {
    return frame;
  }

  const top = getTop(win) || win;
  return findChildFrameByName(top, name);
}

export function isParent(
  win: CrossDomainWindowType,
  frame: CrossDomainWindowType
): boolean {
  const frameParent = getParent(frame);

  if (frameParent) {
    return frameParent === win;
  }

  for (const childFrame of getFrames(win)) {
    if (childFrame === frame) {
      return true;
    }
  }

  return false;
}

export function isOpener(
  parent: CrossDomainWindowType,
  child: CrossDomainWindowType
): boolean {
  return parent === getOpener(child);
}

export function getAncestor(
  win: CrossDomainWindowType = window
): CrossDomainWindowType | null | undefined {
  win = win || window;
  const opener = getOpener(win);

  if (opener) {
    return opener;
  }

  const parent = getParent(win);

  if (parent) {
    return parent;
  }
}

export function getAncestors(
  win: CrossDomainWindowType
): ReadonlyArray<CrossDomainWindowType> {
  const results = [];
  let ancestor = win;

  while (ancestor) {
    // @ts-ignore
    ancestor = getAncestor(ancestor);

    if (ancestor) {
      results.push(ancestor);
    }
  }

  return results;
}

export function isAncestor(
  parent: CrossDomainWindowType,
  child: CrossDomainWindowType
): boolean {
  const actualParent = getAncestor(child);

  if (actualParent) {
    if (actualParent === parent) {
      return true;
    }

    return false;
  }

  if (child === parent) {
    return false;
  }

  if (getTop(child) === child) {
    return false;
  }

  for (const frame of getFrames(parent)) {
    if (frame === child) {
      return true;
    }
  }

  return false;
}

export function isPopup(win: CrossDomainWindowType = window): boolean {
  return Boolean(getOpener(win));
}

export function isIframe(win: CrossDomainWindowType = window): boolean {
  return Boolean(getParent(win));
}

export function isFullpage(win: CrossDomainWindowType = window): boolean {
  return Boolean(!isIframe(win) && !isPopup(win));
}

function anyMatch(
  collection1: ReadonlyArray<unknown>,
  collection2: ReadonlyArray<unknown>
): boolean {
  for (const item1 of collection1) {
    for (const item2 of collection2) {
      if (item1 === item2) {
        return true;
      }
    }
  }

  return false;
}

export function getDistanceFromTop(
  win: CrossDomainWindowType = window
): number {
  let distance = 0;
  let parent = win;

  while (parent) {
    // @ts-ignore - trying to reassing to something that might be window
    parent = getParent(parent);

    if (parent) {
      distance += 1;
    }
  }

  return distance;
}

export function getNthParent(
  win: CrossDomainWindowType,
  n = 1
): CrossDomainWindowType | undefined | null {
  let parent = win;

  for (let i = 0; i < n; i++) {
    if (!parent) {
      return;
    }

    // @ts-ignore - trying to reassign to something that might be window
    parent = getParent(parent);
  }

  return parent;
}

export function getNthParentFromTop(
  win: CrossDomainWindowType,
  n = 1
): CrossDomainWindowType | null | undefined {
  return getNthParent(win, getDistanceFromTop(win) - n);
}

export function isSameTopWindow(
  win1: CrossDomainWindowType,
  win2: CrossDomainWindowType
): boolean {
  const top1 = getTop(win1) || win1;
  const top2 = getTop(win2) || win2;

  try {
    if (top1 && top2) {
      if (top1 === top2) {
        return true;
      }

      return false;
    }
  } catch (err: unknown) {
    // pass
  }

  const allFrames1 = getAllFramesInWindow(win1);
  const allFrames2 = getAllFramesInWindow(win2);

  if (anyMatch(allFrames1, allFrames2)) {
    return true;
  }

  const opener1 = getOpener(top1);
  const opener2 = getOpener(top2);

  if (opener1 && anyMatch(getAllFramesInWindow(opener1), allFrames2)) {
    return false;
  }

  if (opener2 && anyMatch(getAllFramesInWindow(opener2), allFrames1)) {
    return false;
  }

  return false;
}

export function matchDomain(
  pattern: DomainMatcher,
  origin: DomainMatcher
): boolean {
  if (typeof pattern === "string") {
    if (typeof origin === "string") {
      return pattern === WILDCARD || origin === pattern;
    }

    if (isRegex(origin)) {
      return false;
    }

    if (Array.isArray(origin)) {
      return false;
    }
  }

  if (isRegex(pattern)) {
    if (isRegex(origin)) {
      return pattern.toString() === origin.toString();
    }

    if (Array.isArray(origin)) {
      return false;
    }

    // @ts-ignore - earlier already shortcutted the string case
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return Boolean(origin.match(pattern));
  }

  if (Array.isArray(pattern)) {
    if (Array.isArray(origin)) {
      return JSON.stringify(pattern) === JSON.stringify(origin);
    }

    if (isRegex(origin)) {
      return false;
    }

    return pattern.some((subpattern: DomainMatcher) =>
      matchDomain(subpattern, origin)
    );
  }

  return false;
}

export function stringifyDomainPattern(pattern: DomainMatcher): string {
  if (Array.isArray(pattern)) {
    return `(${pattern.join(" | ")})`;
  } else if (isRegex(pattern)) {
    return `RegExp(${pattern.toString()})`;
  } else {
    return pattern.toString();
  }
}

export function getDomainFromUrl(url: string): string {
  let domain;

  if (url.match(/^(https?|mock|file):\/\//)) {
    domain = url;
  } else {
    return getDomain();
  }

  domain = domain.split("/").slice(0, 3).join("/");
  return domain;
}

export function onCloseWindow(
  win: CrossDomainWindowType,
  callback: (...args: Array<unknown>) => void,
  delay = 1000,
  maxtime = Infinity
): { cancel: () => void } {
  let timeout: NodeJS.Timeout;

  const check = (): void => {
    if (isWindowClosed(win)) {
      if (timeout) {
        clearTimeout(timeout);
      }

      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      return callback();
    }

    if (maxtime <= 0) {
      clearTimeout(timeout);
    } else {
      maxtime -= delay;
      timeout = setTimeout(check, delay);
    }
  };

  check();

  return {
    cancel() {
      if (timeout) {
        clearTimeout(timeout);
      }
    },
  };
}

// eslint-disable-next-line complexity
export function isWindow(obj: unknown): boolean {
  try {
    if (obj === window) {
      return true;
    }
  } catch (err: unknown) {
    if (err && (err as Error).message === IE_WIN_ACCESS_ERROR) {
      return true;
    }
  }

  try {
    if (Object.prototype.toString.call(obj) === "[object Window]") {
      return true;
    }
  } catch (err: unknown) {
    if (err && (err as Error).message === IE_WIN_ACCESS_ERROR) {
      return true;
    }
  }

  try {
    if (window.Window && obj instanceof window.Window) {
      return true;
    }
  } catch (err: unknown) {
    if (err && (err as Error).message === IE_WIN_ACCESS_ERROR) {
      return true;
    }
  }

  try {
    // @ts-ignore not complete sure that obj has self. needs guard
    if (obj && obj.self === obj) {
      return true;
    }
  } catch (err: unknown) {
    if (err && (err as Error).message === IE_WIN_ACCESS_ERROR) {
      return true;
    }
  }

  try {
    // @ts-ignore not complete sure that obj has parent. needs guard
    if (obj && obj.parent === obj) {
      return true;
    }
  } catch (err: unknown) {
    if (err && (err as Error).message === IE_WIN_ACCESS_ERROR) {
      return true;
    }
  }

  try {
    // @ts-ignore not complete sure that obj has top. needs guard
    if (obj && obj.top === obj) {
      return true;
    }
  } catch (err: unknown) {
    if (err && (err as Error).message === IE_WIN_ACCESS_ERROR) {
      return true;
    }
  }

  try {
    // @ts-ignore this equality check is a self compare
    // eslint-disable-next-line  @typescript-eslint/no-confusing-void-expression, no-self-compare
    if (noop(obj === obj) === "__unlikely_value__") {
      return false;
    }
  } catch (err: unknown) {
    return true;
  }

  try {
    if (
      obj &&
      // @ts-ignore more shenanigans
      obj.__cross_domain_utils_window_check__ === "__unlikely_value__"
    ) {
      return false;
    }
  } catch (err: unknown) {
    return true;
  }

  try {
    // @ts-ignore needs guard
    if ("postMessage" in obj && "self" in obj && "location" in obj) {
      return true;
    }
  } catch (err: unknown) {
    // pass
  }

  return false;
}

export function isBrowser(): boolean {
  return (
    typeof window !== "undefined" && typeof window.location !== "undefined"
  );
}

export function isCurrentDomain(domain: string): boolean {
  if (!isBrowser()) {
    return false;
  }

  return getDomain() === domain;
}

export function isMockDomain(domain: string): boolean {
  return domain.indexOf(PROTOCOL.MOCK) === 0;
}

export function normalizeMockUrl(url: string): string {
  if (!isMockDomain(getDomainFromUrl(url))) {
    return url;
  }

  // @ts-ignore - global
  if (!__TEST__) {
    throw new Error(`Mock urls not supported out of test mode`);
  }

  return url.replace(/^mock:\/\/[^/]+/, getActualDomain(window));
}

export function getFrameForWindow(
  win: CrossDomainWindowType
): HTMLElement | Element | null | undefined {
  if (isSameDomain(win)) {
    return assertSameDomain(win).frameElement;
  }

  // @ts-ignore not an array type, but is iterable so fine
  for (const frame of document.querySelectorAll("iframe")) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (frame && frame.contentWindow && frame.contentWindow === win) {
      return frame as HTMLElement;
    }
  }
}

export function closeWindow(win: CrossDomainWindowType): void {
  if (isIframe(win)) {
    const frame = getFrameForWindow(win);
    if (frame && frame.parentElement) {
      frame.parentElement.removeChild(frame);
      return;
    }
  }

  try {
    win.close();
  } catch (err) {
    // pass
  }
}
