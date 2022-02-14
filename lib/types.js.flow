/* @flow */

// export something to force webpack to see this as an ES module
export const TYPES = true;

export type CrossDomainLocationType = {|

|};

export type CrossDomainWindowType = {|
    location : string | CrossDomainLocationType,
    self : CrossDomainWindowType,
    closed : boolean,
    open : (string, string, string) => CrossDomainWindowType,
    close : () => void,
    focus : () => void,
    top : CrossDomainWindowType,
    frames : $ReadOnlyArray<CrossDomainWindowType>,
    opener ? : CrossDomainWindowType,
    parent : CrossDomainWindowType,
    length : number,
    postMessage : (string, string) => void
|};

export type SameDomainWindowType = Object & {|
    location : string | Object,
    self : CrossDomainWindowType,
    closed : boolean,
    open : (string, string, string) => CrossDomainWindowType,
    close : () => void,
    focus : () => void,
    XMLHttpRequest : typeof XMLHttpRequest,
    document : Document,
    navigator : {|
        userAgent : string,
        mockUserAgent? : string
    |}
|};

export type DomainMatcher = string | $ReadOnlyArray<string> | $ReadOnlyArray<string> | RegExp;
