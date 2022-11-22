import { assert, test } from "vitest";

import { getParents } from "../src";

import { getCrossDomainWindow } from "./utils";

test("getParents should get all of a windows parents", () => {
  const win = getCrossDomainWindow({
    parent: {
      parent: {
        parent: {},
      },
    },
  });

  // @ts-expect-error window.parent is readonly
  win.parent.parent.parent.parent = win.parent.parent.parent;
  const parents = getParents(win);

  assert(
    parents.length === 3,
    `Expected to get 3 parents, got ${parents.length}`
  );
  assert(
    parents[0] === win.parent,
    `Expected correct parent window to be returned at index 0`
  );
  assert(
    parents[1] === win.parent.parent,
    `Expected correct parent window to be returned at index 1`
  );
  assert(
    parents[2] === win.parent.parent.parent,
    `Expected correct parent window to be returned at index 2`
  );
});
