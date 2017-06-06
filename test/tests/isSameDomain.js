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

    it('should only get procotol and host for a given window once during a domain lookup', () => {

        let locationGet = 0;
        let protocolGet = 0;
        let hostGet = 0;

        let win = {
            get location() {
                locationGet += 1;
                return {
                    get protocol() {
                        protocolGet += 1;
                        return 'https:';
                    },
                    get host() {
                        hostGet += 1;
                        return 'foobar.com:12345';
                    }
                };
            }
        };

        isSameDomain(win);
        isSameDomain(win);
        isSameDomain(win);
        isSameDomain(win);

        if (locationGet !== 1) {
            throw new Error(`Expected win.location to have been accessed 1 time, got ${locationGet} times`);
        }

        if (protocolGet !== 1) {
            throw new Error(`Expected win.location.protocol to have been accessed 1 time, got ${protocolGet} times`);
        }

        if (hostGet !== 1) {
            throw new Error(`Expected win.location.host to have been accessed 1 time, got ${hostGet} times`);
        }
    });

    it('should  get procotol and host for a given window multiple times if looked up after a delay', (done) => {

        let locationGet = 0;
        let protocolGet = 0;
        let hostGet = 0;

        let win = {
            get location() {
                locationGet += 1;
                return {
                    get protocol() {
                        protocolGet += 1;
                        return 'https:';
                    },
                    get host() {
                        hostGet += 1;
                        return 'foobar.com:12345';
                    }
                };
            }
        };

        isSameDomain(win);
        isSameDomain(win);
        isSameDomain(win);
        isSameDomain(win);

        setTimeout(() => {

            isSameDomain(win);
            isSameDomain(win);
            isSameDomain(win);
            isSameDomain(win);

            if (locationGet !== 2) {
                return done(new Error(`Expected win.location to have been accessed 1 time, got ${locationGet} times`));
            }

            if (protocolGet !== 2) {
                return done(new Error(`Expected win.location.protocol to have been accessed 1 time, got ${protocolGet} times`));
            }

            if (hostGet !== 2) {
                return done(new Error(`Expected win.location.host to have been accessed 1 time, got ${hostGet} times`));
            }

            return done();

        }, 10);
    });
});
