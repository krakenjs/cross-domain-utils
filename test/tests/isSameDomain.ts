import { isSameDomain } from '../../src';
import { getSameDomainWindow } from '../win';

describe('isSameDomain cases', () => {

    it('should give a positive result for isSameDomain', () => {
        const win = getSameDomainWindow({
            location: {
                protocol: window.location.protocol,
                host:     window.location.host
            }
        });
        const result = isSameDomain(win);
        const expectedResult = true;

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
        }
    });

    it('should give a negative result for isSameDomain with a different protocol', () => {
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

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
        }
    });

    it('should give a negative result for isSameDomain with a different host', () => {
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

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
        }
    });

    it('should give a negative result for isSameDomain with a different protocol and host', () => {
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

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
        }
    });

    it('should give a negative result for isSameDomain when an error is thrown on protocol', () => {
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

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
        }
    });

    it('should give a negative result for isSameDomain when an error is thrown on host', () => {
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

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
        }
    });

    it('should give a negative result for isSameDomain when location is non-enumerable', () => {
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

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
        }
    });

    it('should give a positive result for isSameDomain when mockDomain matches', () => {
        // @ts-ignore
        window.mockDomain = 'mock://foobar.com:12345';
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

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
        }

        // @ts-ignore
        delete window.mockDomain;
    });

    it('should give a negative result for isSameDomain when mockDomain does not match', () => {
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

        if (result !== expectedResult) {
            throw new Error(`Expected isSameDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`);
        }

        // @ts-ignore
        delete window.mockDomain;
    });

});
