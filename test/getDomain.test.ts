import { getDomain } from '../src';

import { getSameDomainWindow } from './utils';


test('getDomain should get the domain for the current window', () => {
    // @ts-ignore
    window.location = new URL('https://www.paypal.com/sdk/js');
    const domain = getDomain();
    const expectedDomain = `${ window.location.protocol }//${ window.location.host }`;

    expect(domain).toEqual(expectedDomain);
});

test('getDomain should get the domain for a specific window', () => {
    const win = getSameDomainWindow({
        location: {
            protocol: 'https:',
            host:     'foo.com:8087'
        }
    });
    const domain = getDomain(win);
    const expectedDomain = `${ win.location.protocol }//${ win.location.host }`;

    expect(domain).toEqual(expectedDomain);
});

test('getDomain should get the mock domain for a specific window', () => {
    const win = getSameDomainWindow({
        location: {
            protocol: 'https:',
            host:     'foo.com:8087'
        },
        mockDomain: 'mock://zomg.com:3456'
    });
    const domain = getDomain(win);
    const expectedDomain = 'mock://zomg.com:3456';

    expect(domain).toEqual(expectedDomain);
});

test('getDomain should get the actual domain for a specific window when mock domain is not mock://', () => {
    const win = getSameDomainWindow({
        location: {
            protocol: 'https:',
            host:     'foo.com:8087'
        },
        mockDomain: 'mocc://zomg.com:3456'
    });
    const domain = getDomain(win);
    const expectedDomain = `${ win.location.protocol }//${ win.location.host }`;

    expect(domain).toEqual(expectedDomain);
});

test('getDomain should throw errors when the window does not have a location', () => {
    const win = getSameDomainWindow({
        location:   null,
        mockDomain: 'mocc://zomg.com:3456'
    });
    let error;

    try {
        getDomain(win);
    } catch (err : unknown) {
        error = err;
    }

    expect(error).toBeInstanceOf(Error);
});

test('getDomain should throw errors when the window does not have a protocol', () => {
    const win = getSameDomainWindow({
        location: {
            protocol: null,
            host:     'foo.com:8087'
        },
        mockDomain: 'mocc://zomg.com:3456'
    });
    let error;

    try {
        getDomain(win);
    } catch (err : unknown) {
        error = err;
    }

    expect(error).toBeInstanceOf(Error);
});

test('getDomain should throw errors when the window does not have a host', () => {
    const win = getSameDomainWindow({
        location: {
            protocol: 'https:',
            host:     null
        },
        mockDomain: 'mocc://zomg.com:3456'
    });
    let error;

    try {
        getDomain(win);
    } catch (err : unknown) {
        error = err;
    }
    expect(error).toBeInstanceOf(Error);

});

test('getDomain should get the domain for a specific window when its protocol is file:// even with no host', () => {
    const win = getSameDomainWindow({
        location: {
            protocol: 'file:'
        }
    });
    const domain = getDomain(win);
    const expectedDomain = `${ win.location.protocol }//`;

    expect(domain).toEqual(expectedDomain);
});

