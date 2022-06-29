import { assert, test } from "vitest";

import { getOpener } from "../src";

import { getCrossDomainWindow } from "./utils";

test("getOpener should get the opener window if there is one", () => {
  const win = getCrossDomainWindow({
    opener: {},
  });
  const opener = getOpener(win);

  assert(opener === win.opener, `Expected getOpener to return opener window`);
});

test("getOpener should not get the opener window if the window has a parent", () => {
  const win = getCrossDomainWindow({
    parent: {},
    opener: {},
  });
  const opener = getOpener(win);

  assert(!opener, `Expected getOpener to not return a window`);
});

test("getOpener should not get the opener window if nothing is passed", () => {
  const opener = getOpener();

  assert(!opener, `Expected getOpener to not return a window`);
});

test("getOpener should return void in case of any errors", () => {
  const win = getCrossDomainWindow({});

  Object.defineProperty(win, "opener", {
    get() {
      throw new Error("error");
    },
  });
  const opener = getOpener(win);

  assert(!opener, `Expected getOpener to not return a window`);
});
