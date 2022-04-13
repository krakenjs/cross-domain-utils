import { assert, test } from 'vitest';

import { closeWindow } from '../src';

import { getSameDomainWindow } from './utils';


test('closeWindow will call window.close', () => {
    let fnCalled = false;
    const win = getSameDomainWindow({
        close: () => {
            fnCalled = true;
        }
    });

    // @ts-ignore
    closeWindow(win);

    assert(fnCalled, `Expected window.close to be called`);
});

