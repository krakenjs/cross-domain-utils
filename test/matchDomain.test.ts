import { matchDomain } from '../src';

test('matchDomain returns true when domain is a string and origin is a string', () => {
    expect(matchDomain([ 'http://domain' ], 'http://domain')).toBe(true);
});

test('matchDomain returns true when domain is regex and origin is a string', () => {
    expect(matchDomain(/^http:\/\/domain$/, 'http://domain')).toBe(true);
});

test('matchDomain returns true when domain is array with a wildcard and origin is a string', () => {
    expect(matchDomain([ '*' ], 'http://domain')).toBe(true);
});

test('matchDomain returns true when domain is array of strings and origin is a string', () => {
    expect(matchDomain([ 'http://domain' ], 'http://domain')).toBe(true);
});
