import type { CrossDomainWindowType, SameDomainWindowType } from "../src/types";

export function getCrossDomainWindow(
  options: Record<string, unknown>
): CrossDomainWindowType {
  // @ts-expect-error not a true window type
  return {
    ...options,
  };
}

export function getSameDomainWindow(
  options: Record<string, unknown>
): CrossDomainWindowType | SameDomainWindowType | Window {
  // @ts-expect-error not a true window type
  return {
    ...options,
  };
}
