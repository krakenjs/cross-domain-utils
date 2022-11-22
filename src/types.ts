export type CrossDomainWindowType = Window;

export type SameDomainWindowType = Omit<
  Window,
  "frames" | "parent" | "focus" | "top" | "opener" | "postMessage"
>;

export type DomainMatcher =
  | string
  | readonly string[]
  | readonly string[]
  | RegExp;
