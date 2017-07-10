/* @flow */

import { getDomain } from 'src/index';
import { describe, it } from 'mocha';

describe('getDomain cases', () => {

    it('should get the domain for the current window', () => {

        let domain = getDomain();
        let expectedDomain = `${window.location.protocol}//${window.location.host}`;

        if (domain !== expectedDomain) {
            throw new Error(`Expected domain to be "${expectedDomain}", got "${domain}"`);
        }
    });

    it('should get the domain for a specific window', () => {

        let win = {
            location: {
                protocol: 'https:',
                host: 'foo.com:8087'
            }
        };

        let domain = getDomain(win);
        let expectedDomain = `${win.location.protocol}//${win.location.host}`;

        if (domain !== expectedDomain) {
            throw new Error(`Expected domain to be "${expectedDomain}", got "${domain}"`);
        }
    });

    it('should get the mock domain for a specific window', () => {

        let win = {
            location: {
                protocol: 'https:',
                host: 'foo.com:8087'
            },
            mockDomain: 'mock://zomg.com:3456'
        };

        let domain = getDomain(win);
        let expectedDomain = 'mock://zomg.com:3456';

        if (domain !== expectedDomain) {
            throw new Error(`Expected domain to be "${expectedDomain}", got "${domain}"`);
        }
    });

    it('should get the actual domain for a specific window when mock domain is not mock://', () => {

        let win = {
            location: {
                protocol: 'https:',
                host: 'foo.com:8087'
            },
            mockDomain: 'mocc://zomg.com:3456'
        };

        let domain = getDomain(win);
        let expectedDomain = `${win.location.protocol}//${win.location.host}`;

        if (domain !== expectedDomain) {
            throw new Error(`Expected domain to be "${expectedDomain}", got "${domain}"`);
        }
    });

    it('should throw errors when the window does not have a location', () => {

        let win = {
            location: null,
            mockDomain: 'mocc://zomg.com:3456'
        };

        let error;

        try {
            getDomain(win);
        } catch (err) {
            error = err;
        }

        if (!(error instanceof Error)) {
            throw new Error(`Expected to get Error, got ${typeof error}`);
        }
    });

    it('should throw errors when the window does not have a protocol', () => {

        let win = {
            location: {
                protocol: null,
                host: 'foo.com:8087'
            },
            mockDomain: 'mocc://zomg.com:3456'
        };

        let error;

        try {
            getDomain(win);
        } catch (err) {
            error = err;
        }

        if (!(error instanceof Error)) {
            throw new Error(`Expected to get Error, got ${typeof error}`);
        }
    });

    it('should throw errors when the window does not have a host', () => {

        let win = {
            location: {
                protocol: 'https:',
                host: null
            },
            mockDomain: 'mocc://zomg.com:3456'
        };

        let error;

        try {
            getDomain(win);
        } catch (err) {
            error = err;
        }

        if (!(error instanceof Error)) {
            throw new Error(`Expected to get Error, got ${typeof error}`);
        }
    });

    it('should get the domain for a specific window when its protocol is file:// even with no host', () => {

        let win = {
            location: {
                protocol: 'file:'
            }
        };

        let domain = getDomain(win);
        let expectedDomain = `${win.location.protocol}//`;

        if (domain !== expectedDomain) {
            throw new Error(`Expected domain to be "${expectedDomain}", got "${domain}"`);
        }
    });
});
