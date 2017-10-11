/* @flow */

import { isSameDomain } from 'src/index';
import { describe, it } from 'mocha';
import { getSameDomainWindow } from '../win';

describe('isSameDomain cases', () => {

    it('should give a positive result for isSameDomain', () => {

        let win = getSameDomainWindow({
            location: {
                protocol: window.location.protocol,
                host: window.location.host
            }
        });

        let result = isSameDomain(win);
        let expectedResult = true;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }
    });

    it('should give a negative result for isSameDomain with a different protocol', () => {

        let win = getSameDomainWindow({
            location: {
                protocol: 'https:',
                host: window.location.host
            }
        });

        // $FlowFixMe
        Object.defineProperty(win.location, 'href', {
            get() : string {
                return `${win.location.protocol}//${win.location.host}`;
            }
        });

        let result = isSameDomain(win);
        let expectedResult = false;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }
    });

    it('should give a negative result for isSameDomain with a different host', () => {

        let win = getSameDomainWindow({
            location: {
                protocol: window.location.protocol,
                host: 'foobar.com:12345'
            }
        });

        // $FlowFixMe
        Object.defineProperty(win.location, 'href', {
            get() : string {
                return `${win.location.protocol}//${win.location.host}`;
            }
        });

        let result = isSameDomain(win);
        let expectedResult = false;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }
    });

    it('should give a negative result for isSameDomain with a different protocol and host', () => {

        let win = getSameDomainWindow({
            location: {
                protocol: 'https:',
                host: 'foobar.com:12345'
            }
        });

        // $FlowFixMe
        Object.defineProperty(win.location, 'href', {
            get() : string {
                return `${win.location.protocol}//${win.location.host}`;
            }
        });

        let result = isSameDomain(win);
        let expectedResult = false;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }
    });

    it('should give a negative result for isSameDomain when an error is thrown on protocol', () => {

        let win = getSameDomainWindow({
            location: {
                get protocol() { throw new Error('error'); },
                host: window.location.host
            }
        });

        // $FlowFixMe
        Object.defineProperty(win.location, 'href', {
            get() : string {
                return `${win.location.protocol}//${win.location.host}`;
            }
        });

        let result = isSameDomain(win);
        let expectedResult = false;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }
    });

    it('should give a negative result for isSameDomain when an error is thrown on host', () => {

        let win = getSameDomainWindow({
            location: {
                protocol: window.location.protocol,
                get host() { throw new Error('error'); }
            }
        });

        // $FlowFixMe
        Object.defineProperty(win.location, 'href', {
            get() : string {
                return `${win.location.protocol}//${win.location.host}`;
            }
        });

        let result = isSameDomain(win);
        let expectedResult = false;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }
    });

    it('should give a negative result for isSameDomain when location is non-enumerable', () => {

        let win = getSameDomainWindow({});

        Object.defineProperty(win, 'location', {
            value: {
                protocol: window.location.protocol,
                host: window.location.host
            },
            enumerable: false
        });

        // $FlowFixMe
        Object.defineProperty(win.location, 'href', {
            get() : string {
                return `${win.location.protocol}//${win.location.host}`;
            }
        });

        let result = isSameDomain(win);
        let expectedResult = false;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }
    });

    it('should give a positive result for isSameDomain when mockDomain matches', () => {

        window.mockDomain = 'mock://foobar.com:12345';

        let win = getSameDomainWindow({
            location: {
                protocol: window.location.protocol,
                host: window.location.host
            },
            mockDomain: 'mock://foobar.com:12345'
        });

        // $FlowFixMe
        Object.defineProperty(win.location, 'href', {
            get() : string {
                return `${win.location.protocol}//${win.location.host}`;
            }
        });

        let result = isSameDomain(win);
        let expectedResult = true;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }

        delete window.mockDomain;
    });

    it('should give a negative result for isSameDomain when mockDomain does not match', () => {

        window.mockDomain = 'mock://fizzbuzz.com:345';

        let win = getSameDomainWindow({
            location: {
                protocol: window.location.protocol,
                host: window.location.host
            },
            mockDomain: 'mock://foobar.com:12345'
        });

        // $FlowFixMe
        Object.defineProperty(win.location, 'href', {
            get() : string {
                return `${win.location.protocol}//${win.location.host}`;
            }
        });

        let result = isSameDomain(win);
        let expectedResult = false;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${expectedResult.toString()}", got "${result.toString()}"`);
        }

        delete window.mockDomain;
    });
});
