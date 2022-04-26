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
    expect(fnCalled).toBeTruthy();
});

