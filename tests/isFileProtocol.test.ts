import { assert, test } from 'vitest';

import { isFileProtocol, PROTOCOL } from '../src';

import { getSameDomainWindow } from './utils';


test('isFileProtocol will return true when window.location is pointing to a file', () => {
    const win = getSameDomainWindow({
        location: {
            protocol: PROTOCOL.FILE
        }
    });
    const expectedResult = true;
    const result = isFileProtocol(win);
    assert(
        result === expectedResult,
        `Expected result to be ${ expectedResult.toString() } but received ${ result.toString() }`
    );
});

test('isFileProtocol will return true when window.location is pointing to a file', () => {
    const win = getSameDomainWindow({
        location: {
            protocol: PROTOCOL.ABOUT
        }
    });
    const expectedResult = false;
    const result = isFileProtocol(win);
    assert(
        result === expectedResult,
        `Expected result to be ${ expectedResult.toString() } but received ${ result.toString() }`
    );
});

