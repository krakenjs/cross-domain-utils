export type CrossDomainWindowType = Window;

export type SameDomainWindowType = Omit<
  Window,
  "frames" | "parent" | "focus" | "top" | "opener" | "postMessage"
>;

export type DomainMatcher =
  | string
  | ReadonlyArray<string>
  | ReadonlyArray<string>
  | RegExp;
