/* @flow */

import { assert } from 'chai';

import { isChildFrame } from '../../src';

describe('isChildFrame', () => {
    it('should return false when child frame is not from parent window', () => {
        assert.isFalse(isChildFrame(window));
    });
});

