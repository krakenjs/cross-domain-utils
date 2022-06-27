/* @flow */

import type { CrossDomainWindowType, SameDomainWindowType } from "../src/types";

export function getCrossDomainWindow(options: Object): CrossDomainWindowType {
  return {
    ...options,
  };
}

export function getSameDomainWindow(options: Object): SameDomainWindowType {
  return {
    ...options,
  };
}
