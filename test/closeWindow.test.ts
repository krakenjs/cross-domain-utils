import { assert, test } from "vitest";

import { closeWindow } from "../src";

import { getSameDomainWindow } from "./utils";

test("closeWindow will call window.close", () => {
  let fnCalled = false;
  const win = getSameDomainWindow({
    close: () => {
      fnCalled = true;
    },
  });

  // @ts-expect-error Argument of type 'Window | SameDomainWindowType' is not assignable to parameter of type 'Window'
  closeWindow(win);

  assert(fnCalled, `Expected window.close to be called`);
});
