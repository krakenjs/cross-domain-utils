import { getParents } from '../../src';
import { getCrossDomainWindow } from '../win';

describe('getParents cases', () => {

    it('should get all of a windows parents', () => {
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

        if (parents.length !== 3) {
            throw new Error(`Expected to get 3 parents, got ${ parents.length }`);
        }

        if (parents[0] !== win.parent) {
            throw new Error(
                `Expected correct parent window to be returned at index 0`
            );
        }

        if (parents[1] !== win.parent.parent) {
            throw new Error(
                `Expected correct parent window to be returned at index 1`
            );
        }

        if (parents[2] !== win.parent.parent.parent) {
            throw new Error(
                `Expected correct parent window to be returned at index 2`
            );
        }
    });

});
