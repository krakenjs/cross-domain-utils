import { assert, test } from 'vitest';

import { isSameDomain } from '../src';

import { getSameDomainWindow } from './utils';


test('isSameDomain should give a positive result for isSameDomain', () => {
    // @ts-ignore
    window.location = new URL('http://www.paypal.com/sdk/js');

    const win = getSameDomainWindow({
        location: {
            protocol: window.location.protocol,
            host:     window.location.host
        }
    });

    const result = isSameDomain(win);
    const expectedResult = true;

    assert(result === expectedResult, `Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);

});

test('isSameDomain should give a negative result for isSameDomain with a different protocol', () => {
    const win = getSameDomainWindow({
        location: {
            protocol: 'https:',
            host:     window.location.host
        }
    });
        // $FlowFixMe
    Object.defineProperty(win.location, 'href', {
        get() : string {
            return `${ win.location.protocol }//${ win.location.host }`;
        }
    });
    const result = isSameDomain(win);
    const expectedResult = false;

    assert(result === expectedResult, `Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
});

test('isSameDomain should give a negative result for isSameDomain with a different host', () => {
    const win = getSameDomainWindow({
        location: {
            protocol: window.location.protocol,
            host:     'foobar.com:12345'
        }
    });

    Object.defineProperty(win.location, 'href', {
        get() : string {
            return `${ win.location.protocol }//${ win.location.host }`;
        }
    });
    const result = isSameDomain(win);
    const expectedResult = false;

    assert(result === expectedResult, `Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
});

test('isSameDomain should give a negative result for isSameDomain with a different protocol and host', () => {
    const win = getSameDomainWindow({
        location: {
            protocol: 'https:',
            host:     'foobar.com:12345'
        }
    });
    Object.defineProperty(win.location, 'href', {
        get() : string {
            return `${ win.location.protocol }//${ win.location.host }`;
        }
    });
    const result = isSameDomain(win);
    const expectedResult = false;

    assert(result === expectedResult, `Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
});

test('isSameDomain should give a negative result for isSameDomain when an error is thrown on protocol', () => {
    const win = getSameDomainWindow({
        location: {
            get protocol() {
                throw new Error('error');
            },

            host: window.location.host
        }
    });
    Object.defineProperty(win.location, 'href', {
        get() : string {
            return `${ win.location.protocol }//${ win.location.host }`;
        }
    });
    const result = isSameDomain(win);
    const expectedResult = false;

    assert(result === expectedResult, `Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
});

test('isSameDomain should give a negative result for isSameDomain when an error is thrown on host', () => {
    const win = getSameDomainWindow({
        location: {
            protocol: window.location.protocol,

            get host() {
                throw new Error('error');
            }
        }
    });
    Object.defineProperty(win.location, 'href', {
        get() : string {
            return `${ win.location.protocol }//${ win.location.host }`;
        }
    });
    const result = isSameDomain(win);
    const expectedResult = false;

    assert(result === expectedResult, `Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
});

test('isSameDomain should give a negative result for isSameDomain when location is non-enumerable', () => {
    const win = getSameDomainWindow({});
    Object.defineProperty(win, 'location', {
        value: {
            protocol: window.location.protocol,
            host:     window.location.host
        },
        enumerable: false
    });
    Object.defineProperty(win.location, 'href', {
        get() : string {
            return `${ win.location.protocol }//${ win.location.host }`;
        }
    });
    const result = isSameDomain(win);
    const expectedResult = false;

    assert(result === expectedResult, `Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
});

test('isSameDomain should give a positive result for isSameDomain when mockDomain matches', () => {
    // @ts-ignore
    window.mockDomain = 'mock://foobar.com:12345';
    // @ts-ignore
    window.location = new URL('mock://foobar.com:12345');

    const win = getSameDomainWindow({
        location: {
            protocol: window.location.protocol,
            host:     window.location.host
        },
        mockDomain: 'mock://foobar.com:12345'
    });
    Object.defineProperty(win.location, 'href', {
        get() : string {
            return `${ win.location.protocol }//${ win.location.host }`;
        }
    });
    const result = isSameDomain(win);
    const expectedResult = true;

    assert(result === expectedResult, `Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
});

test('isSameDomain should give a negative result for isSameDomain when mockDomain does not match', () => {
    // @ts-ignore
    window.mockDomain = 'mock://fizzbuzz.com:345';
    const win = getSameDomainWindow({
        location: {
            protocol: window.location.protocol,
            host:     window.location.host
        },
        mockDomain: 'mock://foobar.com:12345'
    });
    Object.defineProperty(win.location, 'href', {
        get() : string {
            return `${ win.location.protocol }//${ win.location.host }`;
        }
    });
    const result = isSameDomain(win);
    const expectedResult = false;

    assert(result === expectedResult, `Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
});
