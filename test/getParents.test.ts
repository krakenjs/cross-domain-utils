import { getParents } from '../src';

import { getCrossDomainWindow } from './utils';


test('getParents should get all of a windows parents', () => {
    const win = getCrossDomainWindow({
        parent: {
            parent: {
                parent: {}
            }
        }
    });

    // @ts-ignore
    win.parent.parent.parent.parent = win.parent.parent.parent;
    const parents = getParents(win);

    expect(parents).toHaveLength(3);
    expect(parents[0]).toEqual(win.parent);
    expect(parents[1]).toEqual(win.parent.parent);
    expect(parents[2]).toEqual(win.parent.parent);
});

