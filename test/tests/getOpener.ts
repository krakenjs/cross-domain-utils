import { getOpener } from '../../src';
import { getCrossDomainWindow } from '../win';

describe('getOpener cases', () => {

    it('should get the opener window if there is one', () => {
        const win = getCrossDomainWindow({
            opener: {}
        });
        const opener = getOpener(win);

        if (opener !== win.opener) {
            throw new Error(`Expected getOpener to return opener window`);
        }
    });

    it('should not get the opener window if the window has a parent', () => {
        const win = getCrossDomainWindow({
            parent: {},
            opener: {}
        });
        const opener = getOpener(win);

        if (opener) {
            throw new Error(`Expected getOpener to not return a window`);
        }
    });

    it('should not get the opener window if nothing is passed', () => {
        const opener = getOpener();

        if (opener) {
            throw new Error(`Expected getOpener to not return a window`);
        }
    });

    it('should return void in case of any errors', () => {
        const win = getCrossDomainWindow({});
        // $FlowFixMe
        Object.defineProperty(win, 'opener', {
            get() {
                throw new Error('error');
            }
        });
        const opener = getOpener(win);

        if (opener) {
            throw new Error(`Expected getOpener to not return a window`);
        }
    });

});
