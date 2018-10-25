import { assert } from 'chai';

import match from '../src';

describe('Match test.', () => {
  it('match of anything should return an object', () => {
    assert(typeof match(1) === 'object', 'Not awesome :(');
  });
});