import { getActualDomain } from '../src';

import { getSameDomainWindow } from './utils';


test('getActualDomain should get the domain for a specific window', () => {
    const win = getSameDomainWindow({
        location: {
            protocol: 'https:',
            host:     'foo.com:8087'
        }
    });

    const domain = getActualDomain(win);
    const expectedDomain = `${ win.location.protocol }//${ win.location.host }`;
    expect(domain).toEqual(expectedDomain);
});
