import { getActualDomain } from '../../src';
import { getSameDomainWindow } from '../win';

describe('getActualDomain cases', () => {

    it('should get the domain for a specific window', () => {
        const win = getSameDomainWindow({
            location: {
                protocol: 'https:',
                host:     'foo.com:8087'
            }
        });

        const domain = getActualDomain(win);
        const expectedDomain = `${ win.location.protocol }//${ win.location.host }`;

        if (domain !== expectedDomain) {
            throw new Error(
                `Expected domain to be "${ expectedDomain }", got "${ domain }"`
            );
        }
    });

});
