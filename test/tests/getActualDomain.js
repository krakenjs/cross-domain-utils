/* @flow */

import { getActualDomain } from 'src/index';
import { describe, it } from 'mocha';

describe('getActualDomain cases', () => {

    it('should get the domain for a specific window', () => {

        let win = {
            location: {
                protocol: 'https:',
                host: 'foo.com:8087'
            }
        };

        let domain = getActualDomain(win);
        let expectedDomain = `${win.location.protocol}//${win.location.host}`;

        if (domain !== expectedDomain) {
            throw new Error(`Expected domain to be "${expectedDomain}", got "${domain}"`);
        }
    });
});
