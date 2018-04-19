/* @flow */

import { getOpener } from '../../src';
import { getCrossDomainWindow } from '../win';

describe('getOpener cases', () => {

    it('should get the opener window if there is one', () => {

        let win = getCrossDomainWindow({
            opener: {}
        });

        let opener = getOpener(win);

        if (opener !== win.opener) {
            throw new Error(`Expected getOpener to return opener window`);
        }
    });

    it('should not get the opener window if the window has a parent', () => {

        let win = getCrossDomainWindow({
            parent: {},
            opener: {}
        });

        let opener = getOpener(win);

        if (opener) {
            throw new Error(`Expected getOpener to not return a window`);
        }
    });

    it('should not get the opener window if nothing is passed', () => {

        let opener = getOpener();

        if (opener) {
            throw new Error(`Expected getOpener to not return a window`);
        }
    });

    it('should return void in case of any errors', () => {

        let win = getCrossDomainWindow({});

        // $FlowFixMe
        Object.defineProperty(win, 'opener', {
            get() {
                throw new Error('error');
            }
        });

        let opener = getOpener(win);

        if (opener) {
            throw new Error(`Expected getOpener to not return a window`);
        }
    });
});
