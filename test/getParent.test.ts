import { getParent } from '../src';

import { getCrossDomainWindow } from './utils';


test('getParent should get the parent window if there is one', () => {
    const win = getCrossDomainWindow({
        parent: {}
    });
    const parent = getParent(win);

    expect(parent).toEqual(win.parent);
});

test('getParent should not get the parent window if the parent is the same window', () => {
    const win = getCrossDomainWindow({});
    // @ts-ignore
    win.parent = win;
    const parent = getParent(win);

    expect(parent).toBeFalsy();
});

test('getParent should return void in case of any errors', () => {
    const win = getCrossDomainWindow({});

    Object.defineProperty(win, 'parent', {
        get() {
            throw new Error('error');
        }
    });
    const parent = getParent(win);

    expect(parent).toBeFalsy();
});
