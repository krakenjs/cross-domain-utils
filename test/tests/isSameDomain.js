/* @flow */

import { isSameDomain } from 'src/index';

describe('isSameDomain cases', () => {

    it('should give a positive result for isSameDomain', () => {

        let win = {
            location: {
                protocol: window.location.protocol,
                host: window.location.host
            }
        };

        let result = isSameDomain(win);
        let expectedResult = true;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }
    });

    it('should give a negative result for isSameDomain with a different protocol', () => {

        let win = {
            location: {
                protocol: 'https:',
                host: window.location.host
            }
        };

        let result = isSameDomain(win);
        let expectedResult = false;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }
    });

    it('should give a negative result for isSameDomain with a different host', () => {

        let win = {
            location: {
                protocol: window.location.protocol,
                host: 'foobar.com:12345'
            }
        };

        let result = isSameDomain(win);
        let expectedResult = false;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }
    });

    it('should give a negative result for isSameDomain with a different protocol and host', () => {

        let win = {
            location: {
                protocol: 'https:',
                host: 'foobar.com:12345'
            }
        };

        let result = isSameDomain(win);
        let expectedResult = false;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }
    });

    it('should give a negative result for isSameDomain when an error is thrown on protocol', () => {

        let win = {
            location: {
                get protocol() { throw new Error('error'); },
                host: window.location.host
            }
        };

        let result = isSameDomain(win);
        let expectedResult = false;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }
    });

    it('should give a negative result for isSameDomain when an error is thrown on host', () => {

        let win = {
            location: {
                protocol: window.location.protocol,
                get host() { throw new Error('error'); }
            }
        };

        let result = isSameDomain(win);
        let expectedResult = false;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }
    });

    it('should give a negative result for isSameDomain when location is non-enumerable', () => {

        let win = {};

        Object.defineProperty(win, 'location', {
            value: {
                protocol: window.location.protocol,
                host: window.location.host
            },
            enumerable: false
        });

        let result = isSameDomain(win);
        let expectedResult = false;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }
    });

    it('should give a positive result for isSameDomain when mockDomain matches', () => {

        window.mockDomain = 'mock://foobar.com:12345';

        let win = {
            location: {
                protocol: window.location.protocol,
                host: window.location.host
            },
            mockDomain: 'mock://foobar.com:12345'
        };

        let result = isSameDomain(win);
        let expectedResult = true;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }

        delete window.mockDomain;
    });

    it('should give a negative result for isSameDomain when mockDomain does not match', () => {

        window.mockDomain = 'mock://fizzbuzz.com:345';

        let win = {
            location: {
                protocol: window.location.protocol,
                host: window.location.host
            },
            mockDomain: 'mock://foobar.com:12345'
        };

        let result = isSameDomain(win);
        let expectedResult = false;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }

        delete window.mockDomain;
    });
});
