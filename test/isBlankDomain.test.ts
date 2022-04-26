import { isBlankDomain } from '../src';

import { getSameDomainWindow } from './utils';


test('isBlankDomain returns true if window.href is falsy', () => {
    const falsyValues = [ 0, '', null, undefined, NaN ];
    const windows = falsyValues.map((falsyValue) =>
        getSameDomainWindow({
            location: {
                href: falsyValue
            }
        }));
        // @ts-ignore
    const results = windows.map(isBlankDomain);
    const expectedResult = true;

    results.every((result) => { expect(result).toEqual(expectedResult); });
});

test('isBlankDomain returns true if window.href about:blank', () => {
    const win = getSameDomainWindow({
        location: {
            href: 'about:blank'
        }
    });
    const expectedResult = true;
    // @ts-ignore
    const result = isBlankDomain(win);

    expect(result).toEqual(expectedResult);
});

test('isBlankDomain should return false if window.href is truthy but not about:blank', () => {
    const win = getSameDomainWindow({
        location: {
            href: 'someUrl'
        }
    });
    const expectedResult = false;
    // @ts-ignore
    const result = isBlankDomain(win);

    expect(result).toEqual(expectedResult);
});
