import { getParent } from '../../src';
import { getCrossDomainWindow } from '../win';

describe('getParent cases', () => {

    it('should get the parent window if there is one', () => {
        const win = getCrossDomainWindow({
            parent: {}
        });
        const parent = getParent(win);

        if (parent !== win.parent) {
            throw new Error(`Expected getParent to return parent window`);
        }
    });

    it('should not get the parent window if the parent is the same window', () => {
        const win = getCrossDomainWindow({});
        // @ts-ignore
        win.parent = win;
        const parent = getParent(win);

        if (parent) {
            throw new Error(`Expected getParent to not return a window`);
        }
    });

    it('should return void in case of any errors', () => {
        const win = getCrossDomainWindow({});
        // $FlowFixMe
        Object.defineProperty(win, 'parent', {
            get() {
                throw new Error('error');
            }
        });
        const parent = getParent(win);

        if (parent) {
            throw new Error(`Expected getParent to not return a window`);
        }
    });

});
