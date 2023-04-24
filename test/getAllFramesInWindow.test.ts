import { assert, test } from "vitest";

import { getAllFramesInWindow } from "../src";

test("getAllFramesInWindow should get all of the frames", () => {
  const x: Record<string, unknown> = {
    name: "x",
  };
  const y: Record<string, unknown> = {
    name: "y",
    frames: [x],
  };
  const a: Record<string, unknown> = {
    name: "a",
  };
  const b: Record<string, unknown> = {
    name: "b",
    frames: [a],
  };
  const z: Record<string, unknown> = {
    name: "z",
    frames: [b, y],
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

  const allFrames = [a, b, x, y, z];
  // @ts-expect-error x is not type of window
  const foundFrames = getAllFramesInWindow(x);

  assert(
    foundFrames.length === allFrames.length,
    `Expected to find ${allFrames.length}, but found ${foundFrames.length}`
  );

  for (const frame of allFrames) {
    // @ts-expect-error frame is not type of window
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    assert(foundFrames.includes(frame), `Did not find frame ${frame.name}`);
  }
});

test("should get a mock frame defined in window.frames", () => {
  const frames = window.frames;
  const mockFrame = {} as unknown as Window;
  window.frames = [mockFrame] as unknown as Window;
  const foundFrames = getAllFramesInWindow(window);

  assert(
    foundFrames.includes(mockFrame),
    `getAllFramesInWindow expected to find mock frame in window.frames`
  );

  window.frames = frames;
});
