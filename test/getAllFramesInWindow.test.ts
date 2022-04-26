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

    const allFrames   = [ a, b, x, y, z ];

    // @ts-ignore
    const foundFrames = getAllFramesInWindow(x);

    expect(foundFrames.length).toEqual(allFrames.length);

    foundFrames.forEach(currentFrame => {
        const {name} = currentFrame;
        const expectedFrame = allFrames.find(existingFrame => existingFrame.name === name);

        expect(currentFrame).toEqual(expectedFrame);
    });
});

test('should get a mock frame defined in window.frames', () => {
    const mockWin = { ...window };
    const mockFrame = {};
    // @ts-ignore
    mockWin.frames = [ mockFrame ];

    // @ts-ignore
    const foundFrames = getAllFramesInWindow(mockWin);

    // @ts-ignore
    expect(foundFrames.indexOf(mockFrame)).not.toEqual(-1);
});
