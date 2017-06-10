
import { WeakMap } from 'cross-domain-safe-weakmap/src';
import { isRegex } from './util';

let global = window.__crossDomainUtils__ = window.__crossDomainUtils__ || {};
global.domainMatches = global.domainMatches || new WeakMap();

let domainMatchTimeout;

function setWindowMatch(win, match) {

    global.domainMatches = global.domainMatches || new WeakMap();
    global.domainMatches.set(win, match);

    if (!domainMatchTimeout) {
        domainMatchTimeout = setTimeout(() => {
            global.domainMatches = new WeakMap();
            domainMatchTimeout = null;
        }, 1);
    }
}

const CONSTANTS = {
    MOCK_PROTOCOL: 'mock:',
    FILE_PROTOCOL: 'file:',
    WILDCARD: '*'
};

export function getActualDomain(win) {

    let location = win.location;

    if (!location) {
        throw new Error(`Can not read window location`);
    }

    let protocol = location.protocol;

    if (!protocol) {
        throw new Error(`Can not read window protocol`);
    }

    if (protocol === CONSTANTS.FILE_PROTOCOL) {
        return 'file://';
    }

    let host = location.host;

    if (!host) {
        throw new Error(`Can not read window host`);
    }

    return `${protocol}//${host}`;
}

export function getDomain(win) {

    win = win || window;

    let domain = getActualDomain(win);

    if (domain && win.mockDomain && win.mockDomain.indexOf(CONSTANTS.MOCK_PROTOCOL) === 0) {
        return win.mockDomain;
    }

    return domain;
}

export function isActuallySameDomain(win) {

    if (global.domainMatches.has(win)) {
        let match = global.domainMatches.get(win);

        if (match) {
            return true;
        }
    }

    let match = false;

    try {
        if (getActualDomain(win) === getActualDomain(window)) {
            match = true;
        }
    } catch (err) {
        // pass
    }

    if (!match) {
        setWindowMatch(win, match);
    }

    return match;
}

export function isSameDomain(win) {

    if (global.domainMatches.has(win)) {
        return global.domainMatches.get(win);
    }

    let match = false;

    try {
        if (getDomain(window) === getDomain(win)) {
            match = true;
        }
    } catch (err) {
        // pass
    }

    setWindowMatch(win, match);

    return match;
}

export function getParent(win) {

    if (!win) {
        return;
    }

    try {
        if (win.parent && win.parent !== win) {
            return win.parent;
        }
    } catch (err) {
        return;
    }
}

export function getOpener(win) {

    if (!win) {
        return;
    }

    // Make sure we're not actually an iframe which has had window.open() called on us
    if (getParent(win)) {
        return;
    }

    try {
        return win.opener;
    } catch (err) {
        return;
    }
}



export function getParents(win) {

    let result = [];

    try {

        while (win.parent !== win) {
            result.push(win.parent);
            win = win.parent;
        }

    } catch (err) {
        // pass
    }

    return result;
}

export function isAncestorParent(parent, child) {

    if (!parent || !child) {
        return false;
    }

    let childParent = getParent(child);

    if (childParent) {
        return childParent === parent;
    }

    if (getParents(child).indexOf(parent) !== -1) {
        return true;
    }

    return false;
}

export function getFrames(win) {

    let result = [];

    let frames;

    try {
        frames = win.frames;
    } catch (err) {
        frames = win;
    }

    let len;

    try {
        len = frames.length;
    } catch (err) {
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
            } catch (err) {
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
        } catch (err) {
            return result;
        }

        if (!frame) {
            return result;
        }

        result.push(frame);
    }

    return result;
}


export function getAllChildFrames(win) {

    let result = [];

    for (let frame of getFrames(win)) {
        result.push(frame);

        for (let childFrame of getAllChildFrames(frame)) {
            result.push(childFrame);
        }
    }

    return result;
}

export function getAllFramesInWindow(win) {

    let result = getAllChildFrames(win);

    result.push(win);

    for (let parent of getParents(win)) {

        result.push(parent);

        for (let frame of getFrames(parent)) {

            if (result.indexOf(frame) === -1) {
                result.push(frame);
            }
        }
    }

    return result;
}

export function getTop(win) {

    if (!win) {
        return;
    }

    try {
        if (win.top) {
            return win.top;
        }
    } catch (err) {
        // pass
    }

    if (getParent(win) === win) {
        return win;
    }

    try {
        if (isAncestorParent(window, win)) {
            return window.top;
        }
    } catch (err) {
        // pass
    }

    try {
        if (isAncestorParent(win, window)) {
            return window.top;
        }
    } catch (err) {
        // pass
    }

    for (let frame of getAllChildFrames(win)) {
        try {
            if (frame.top) {
                return frame.top;
            }
        } catch (err) {
            // pass
        }

        if (getParent(frame) === frame) {
            return frame;
        }
    }
}


export function isWindowClosed(win, allowMock = true) {

    try {
        if (win === window) {
            return false;
        }
    } catch (err) {
        return true;
    }


    try {
        if (!win) {
            return true;
        }

    } catch (err) {
        return true;
    }

    try {
        if (win.closed) {
            return true;
        }

    } catch (err) {

        // I love you so much IE

        if (err && err.message === 'Call was rejected by callee.\r\n') {
            return false;
        }

        return true;
    }


    if (allowMock && isSameDomain(win)) {
        try {
            if (win.mockclosed) {
                return true;
            }
        } catch (err) {
            // pass
        }
    }

    // Mobile safari

    try {
        if (!win.parent || !win.top) {
            return true;
        }
    } catch (err) {
        // pass
    }


    return false;
}

export function getUserAgent(win) {
    win = win || window;
    return win.navigator.mockUserAgent || win.navigator.userAgent;
}


export function getFrameByName(win, name) {

    let winFrames = getFrames(win);

    for (let childFrame of winFrames) {
        try {
            if (isSameDomain(childFrame) && childFrame.name === name && winFrames.indexOf(childFrame) !== -1) {
                return childFrame;
            }
        } catch (err) {
            // pass
        }
    }

    try {
        if (winFrames.indexOf(win.frames[name]) !== -1) {
            return win.frames[name];
        }
    } catch (err) {
        // pass
    }

    try {
        if (winFrames.indexOf(win[name]) !== -1) {
            return win[name];
        }
    } catch (err) {
        // pass
    }
}

export function findChildFrameByName(win, name) {

    let frame = getFrameByName(win, name);

    if (frame) {
        return frame;
    }

    for (let childFrame of getFrames(win)) {
        let namedFrame = findChildFrameByName(childFrame, name);

        if (namedFrame) {
            return namedFrame;
        }
    }
}

export function findFrameByName(win, name) {

    let frame;

    frame = getFrameByName(win, name);

    if (frame) {
        return frame;
    }

    return findChildFrameByName(getTop(win), name);
}

export function isParent(win, frame) {

    let frameParent = getParent(frame);

    if (frameParent) {
        return frameParent === win;
    }

    for (let childFrame of getFrames(win)) {
        if (childFrame === frame) {
            return true;
        }
    }

    return false;
}

export function isOpener(parent, child) {

    return parent === getOpener(child);
}

export function getAncestor(win) {
    win = win || window;

    let opener = getOpener(win);

    if (opener) {
        return opener;
    }

    let parent = getParent(win);

    if (parent) {
        return parent;
    }
}

export function getAncestors(win) {

    let results = [];

    let ancestor = win;

    while (ancestor) {
        ancestor = getAncestor(ancestor);
        if (ancestor) {
            results.push(ancestor);
        }
    }

    return results;
}


export function isAncestor(parent, child) {

    let actualParent = getAncestor(child);

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

    for (let frame of getFrames(parent)) {
        if (frame === child) {
            return true;
        }
    }

    return false;
}

export function isPopup() {
    return Boolean(getOpener(window));
}

export function isIframe() {
    return Boolean(getParent(window));
}

export function isFullpage() {
    return Boolean(!isIframe() && !isPopup());
}

function anyMatch(collection1, collection2) {

    for (let item1 of collection1) {
        for (let item2 of collection2) {
            if (item1 === item2) {
                return true;
            }
        }
    }
}

export function isSameTopWindow(win1, win2) {

    let top1 = getTop(win1);
    let top2 = getTop(win2);

    try {
        if (top1 && top2) {
            if (top1 === top2) {
                return true;
            }

            return false;
        }
    } catch (err) {
        // pass
    }

    let allFrames1 = getAllFramesInWindow(win1);
    let allFrames2 = getAllFramesInWindow(win2);

    if (anyMatch(allFrames1, allFrames2)) {
        return true;
    }

    let opener1 = getOpener(top1);
    let opener2 = getOpener(top2);

    if (opener1 && anyMatch(getAllFramesInWindow(opener1), allFrames2)) {
        return false;
    }

    if (opener2 && anyMatch(getAllFramesInWindow(opener2), allFrames1)) {
        return false;
    }
}

export function matchDomain(pattern, origin) {

    if (typeof pattern === 'string') {

        if (typeof origin === 'string') {
            return pattern === CONSTANTS.WILDCARD || origin === pattern;
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

        return Boolean(origin.match(pattern));
    }

    if (Array.isArray(pattern)) {

        if (Array.isArray(origin)) {
            return JSON.stringify(pattern) === JSON.stringify(origin);
        }

        if (isRegex(origin)) {
            return false;
        }

        return pattern.some(subpattern => matchDomain(subpattern, origin));
    }

    return false;
}
