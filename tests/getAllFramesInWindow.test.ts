import { assert, test } from 'vitest';

import { getAllFramesInWindow } from '../src';

test('getAllFramesInWindow should get all of the frames', () => {
    const x : Record<string, unknown> = {
        name: 'x'
    };
    const y : Record<string, unknown> = {
        name:   'y',
        frames: [ x ]
    };
    const a : Record<string, unknown> = {
        name: 'a'
    };
    const b : Record<string, unknown> = {
        name:   'b',
        frames: [ a ]
    };
    const z : Record<string, unknown> = {
        name:   'z',
        frames: [ b, y ]
    };
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

    const allFrames = [ a, b, x, y, z ];
    // @ts-ignore x is not type of window
    const foundFrames = getAllFramesInWindow(x);

    assert(foundFrames.length === allFrames.length,  `Expected to find ${ allFrames.length }, but found ${ foundFrames.length }`);

    for (const frame of allFrames) {
        // @ts-ignore frame is not type of window
        assert(foundFrames.includes(frame), `Did not find frame ${ frame.name }`);
    }
});

test('should get a mock frame defined in window.frames', () => {
    const frames = window.frames;
    const mockFrame = {};
    // @ts-ignore
    window.frames = [ mockFrame ];
    const foundFrames = getAllFramesInWindow(window);

    // @ts-ignore
    assert(foundFrames.includes(mockFrame), `getAllFramesInWindow expected to find mock frame in window.frames`);

    // @ts-ignore
    window.frames = frames;
});
