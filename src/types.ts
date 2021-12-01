// export something to force webpack to see this as an ES module
export const TYPES = true;

export type CrossDomainWindowType = Window;

export type SameDomainWindowType = Omit<Window, 'frames' | 'parent' | 'focus' | 'top' | 'opener' | 'postMessage'>;

export type DomainMatcher =
    | string
    | ReadonlyArray<string>
    | ReadonlyArray<string>
    | RegExp;
