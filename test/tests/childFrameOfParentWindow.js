/* @flow */

import { assert } from 'chai';

import { childFrameOfParentWindow } from '../../src';

describe('childFrameOfParentWindow', () => {
    it('should return false when child frame is not from parent window', () => {
        assert.isFalse(childFrameOfParentWindow(window));
    });
});

