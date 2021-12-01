import { expect } from 'chai';

import { stringifyDomainPattern } from '../../src';

describe('stringifyDomainPattern test cases ', () => {

    it('should stringify a single regex expression to RegExp', () => {
        const pattern = /[a-zA-Z0-9]{1,5}/;
        const domainPatternStringified = stringifyDomainPattern(pattern);
        const expected = `RegExp(${ pattern.toString() })`;

        if (typeof domainPatternStringified !== 'string') {
            throw new TypeError(`Expected domainPattern to be string, instead got ${ typeof domainPatternStringified }`);
        }

        expect(domainPatternStringified).to.equal(expected);
    });

    it('should stringify an array of domain patterns to RegExp', () => {
        const p1 = '/[a-zA-Z0-9]{1,5}/';
        const p2 = '/\\.[a-zA-Z]{2,}$/';
        const domainPatternsArray = [ p1, p2 ];
        const domainPatternsArrayStringified = stringifyDomainPattern(domainPatternsArray);
        const expected = `(${ p1 } | ${ p2 })`;

        expect(domainPatternsArrayStringified).to.equal(expected);
    });

});
