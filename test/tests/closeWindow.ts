/* @flow */

import { assert } from "chai";

import { closeWindow } from "../../src";
import { getSameDomainWindow } from "../win";

describe("closeWindow", () => {
  it("will call window.close", () => {
    let fnCalled = false;

    const win = getSameDomainWindow({
      close: () => {
        fnCalled = true;
      },
    });
    const expectedResult = true;
    closeWindow(win);

    assert(fnCalled === expectedResult, `Expected window.close to be called`);
  });
});
