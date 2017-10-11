/* @flow */

export function getCrossDomainWindow(options : Object) : CrossDomainWindowType {
    return {
        ...options
    };
}

export function getSameDomainWindow(options : Object) : SameDomainWindowType {
    return {
        ...options
    };
}