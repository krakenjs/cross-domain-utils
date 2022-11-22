import { assert, test } from "vitest";

import { getParent } from "../src";

import { getCrossDomainWindow } from "./utils";

test("getParent should get the parent window if there is one", () => {
  const win = getCrossDomainWindow({
    parent: {},
  });
  const parent = getParent(win);

  assert(parent === win.parent, `Expected getParent to return parent window`);
});

test("getParent should not get the parent window if the parent is the same window", () => {
  const win = getCrossDomainWindow({});
  // @ts-expect-error window.parent is readonly
  win.parent = win;
  const parent = getParent(win);

  assert(!parent, `Expected getParent to not return a window`);
});

test("getParent should return void in case of any errors", () => {
  const win = getCrossDomainWindow({});

  Object.defineProperty(win, "parent", {
    get() {
      throw new Error("error");
    },
  });
  const parent = getParent(win);

  assert(!parent, `Expected getParent to not return a window`);
});
