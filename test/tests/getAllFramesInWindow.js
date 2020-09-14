/* @flow */

import { getAllFramesInWindow } from '../../src';

describe('getAllFramesInWindow cases', () => {

    it('should get all of the frames', () => {

        let x : Object = { name: 'x' };
        let y : Object = { name: 'y', frames: [ x ] };

        let a : Object = { name: 'a' };
        let b : Object = { name: 'b', frames: [ a ] };

        let z : Object = { name: 'z', frames: [ b, y ] };

        x.top = z;
        x.parent = y;

        y.top = z;
        y.parent = z;

        a.top = z;
        a.parent = b;

        b.top = z;
        b.parent = z;

        z.top = z;
        z.parent = z;

        let allFrames   = [ a, b, x, y, z ];
        let foundFrames = getAllFramesInWindow(x);

        if (foundFrames.length !== allFrames.length) {
            throw new Error(`Expected to find ${ allFrames.length }, but found ${ foundFrames.length }`);
        }

        for (let frame of allFrames) {
            if (foundFrames.indexOf(frame) === -1) {
                throw new Error(`Did not find frame ${ frame.name }`);
            }
        }
    });

    it('should get a mock frame defined in window.frames', () => {
        const frames = window.frames;

        const mockFrame = {};

        window.frames = [ mockFrame ];

        const foundFrames = getAllFramesInWindow(window);

        if (foundFrames.indexOf(mockFrame) === -1) {
            throw new Error(`getAllFramesInWindow expected to find mock frame in window.frames`);
        }

        window.frames = frames;
    });
});
