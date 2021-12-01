import { expect } from 'chai';

import { getDomainFromUrl } from '../../src';

describe('getDomainFromUrl test cases ', () => {

    it('should get url protocol and domain for a simple http url', () => {
        const url = 'http://github.com/krakenjs/cross-domain-utils/';
        const expected = 'http://github.com';
        const domain = getDomainFromUrl(url);
        expect(domain).to.equal(expected);
    });

    it('should get url protocol and domain for a long https url', () => {
        const url =
            'https://www.google.com/search?q=Cross+Domain+utilities+npm&oq=cros&aqs=chrome.0.69i59l3j69i57j69i60l3j69i65.1620j0j7&sourceid=chrome&ie=UTF-8';
        const expected = 'https://www.google.com';
        const domain = getDomainFromUrl(url);
        expect(domain).to.equal(expected);
    });

    it('should get url protocol and domain for a url with non-www subdomain', () => {
        const url = 'https://ca.indeed.com/';
        const expected = 'https://ca.indeed.com';
        const domain = getDomainFromUrl(url);
        expect(domain).to.equal(expected);
    });

    it('should get url protocol and IP of a file url ', () => {
        const url = 'file://192.168.1.11/~User/TextFile.pdf'; // fake IP

        const expected = 'file://192.168.1.11';
        const domain = getDomainFromUrl(url);
        expect(domain).to.equal(expected);
    });

});
