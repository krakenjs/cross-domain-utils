/* @flow */

import { getParent } from 'src/index';

describe('getParent cases', () => {

    it('should get the parent window if there is one', () => {

        let win = {
            parent: {}
        };

        let parent = getParent(win);

        if (parent !== win.parent) {
            throw new Error(`Expected getParent to return parent window`);
        }
    });

    it('should not get the parent window if the parent is the same window', () => {

        let win = {};
        win.parent = win;

        let parent = getParent(win);

        if (parent) {
            throw new Error(`Expected getParent to not return a window`);
        }
    });

    it('should not get the parent window if nothing is passed', () => {

        let parent = getParent();

        if (parent) {
            throw new Error(`Expected getParent to not return a window`);
        }
    });

    it('should return void in case of any errors', () => {

        let win = {};

        // $FlowFixMe
        Object.defineProperty(win, 'parent', {
            get() {
                throw new Error('error');
            }
        });

        let parent = getParent(win);

        if (parent) {
            throw new Error(`Expected getParent to not return a window`);
        }
    });
});
