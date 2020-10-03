/* @flow */

import { expect } from 'chai';

import { stringifyDomainPattern } from '../../src';

describe('stringifyDomainPattern test cases ', () => {

    it('should stringify a single regex expression', () => {

        const pattern = /[a-zA-Z0-9]{1,5}/;
        const domainPattern = stringifyDomainPattern(pattern);

        const expected = `RegExp(${ pattern.toString() })`;

        if (typeof domainPattern !== 'string') {
            throw new TypeError(`Expected domainPattern to be string, instead got ${ typeof domainPattern }`);
        }

        expect(domainPattern).to.equal(expected);

    });
    
});
