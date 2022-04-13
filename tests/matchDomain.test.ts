import { assert, test } from 'vitest';

import { matchDomain } from '../src';

test('matchDomain returns true when domain is a string and origin is a string', () => {
    assert.isTrue(matchDomain([ 'http://domain' ], 'http://domain'));
});

test('matchDomain returns true when domain is regex and origin is a string', () => {
    assert.isTrue(matchDomain(/^http:\/\/domain$/, 'http://domain'));
});

test('matchDomain returns true when domain is array with a wildcard and origin is a string', () => {
    assert.isTrue(matchDomain([ '*' ], 'http://domain'));
});

test('matchDomain returns true when domain is array of strings and origin is a string', () => {
    assert.isTrue(matchDomain([ 'http://domain' ], 'http://domain'));
});
