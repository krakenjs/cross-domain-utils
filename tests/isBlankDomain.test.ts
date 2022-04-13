import { assert, test } from 'vitest';

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
    assert(
        results.every((result) => result === expectedResult),
        `Expected isBlankDomain result to return ${ expectedResult.toString() }`
    );
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
    assert(
        result === expectedResult,
        `Expected isBlankDomain result to be ${ expectedResult.toString() }, got ${ result.toString() }`
    );
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
    assert(
        result === expectedResult,
        `Expected isBlankDomain result to be "${ expectedResult.toString() }", got "${ result.toString() }"`
    );
});