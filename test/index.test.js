import { assert } from 'chai';

import match from '../src';

describe('Match function test.', () => {
  it('Match of anything should return an object.', () => {
    assert.isObject(match(1), 'Match is not an object.');
  });
  it('Then should be available on both successful and unsuccessful matches.', () => {
    assert.isFunction(match(1).on(() => true).then, 'On does not return then function on a match.');
    assert.isFunction(match(1).on(() => false).then, 'On does not return then function without a match.');
  });
  it('Else should provide final evaluation result on both successful and unsuccessful matches.', () => {
    assert.isTrue(match(1).on(() => true).then(true).else(false), 'Else does not provide final evaluation on a match.');
    assert.isTrue(match(1).on(() => true).then(true).else(() => false), 'Else does not provide final evaluation on a match.');
    assert.isFalse(match(1).on(() => false).then(true).else(false), 'Else does not provide final evaluation without a match.');
    assert.isFalse(match(1).on(() => false).then(true).else(() => false), 'Else does not provide final evaluation without a match.');
  });
});

describe('\'On\' function test using evaluation based on functions.', () => {
  it('Then should be available on both successful and unsuccessful matches.', () => {
    assert.isFunction(match(1).on(x => x === 1).then, 'It does not return then function on a match.');
    assert.isFunction(match(1).on(x => x === 2).then, 'It does not return then function without a match.');
  });
  it('\'On\' should match based on a provided function.', () => {
    assert.isTrue(match(1).on(x => x === 1).then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match(1).on(x => x === 2).then(true).else(false), 'It does not correctly match.');
  });
  it('\'On\' on a function returning anything but true should evaluate as false.', () => {
    assert.isFalse(match(1).on(() => 'string').then(true).else(false), 'It on string returns true.');
    assert.isFalse(match(1).on(() => 1).then(true).else(false), 'It on number returns true.');
    assert.isFalse(match(1).on(() => null).then(true).else(false), 'It on null returns true.');
  });
});

describe('\'With\' function test using evaluation based on regular expressions.', () => {
  it('Then should be available on both successful and unsuccessful matches.', () => {
    assert.isFunction(match('string').with(/[a-z]/).then, 'It does not return then function on a match.');
    assert.isFunction(match('string').with(/[0-9]/).then, 'It does not return then function without a match.');
  });
  it('\'With\' should match based on provided regular expression.', () => {
    assert.isTrue(match('string').with(/[a-z]/).then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match('string').with(/[0-9]/).then(true).else(false), 'It does not correctly match.');
  });
});

describe('\'Equals\' function test using evaluation based on strict equal.', () => {
  it('Then should be available on both successful and unsuccessful matches.', () => {
    assert.isFunction(match('string').equals('string').then, 'It does not return then function on a match.');
    assert.isFunction(match(1).equals(2).then, 'It does not return then function without a match.');
  });
  it('\'With\' should match based on provided regular expression.', () => {
    assert.isTrue(match('string').equals('string').then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match(1).equals(2).then(true).else(false), 'It does not correctly match.');
  });
});

describe('\'Includes\' function test using evaluation based on strict equal.', () => {
  it('Then should be available on both successful and unsuccessful matches.', () => {
    assert.isFunction(match('string').includes('st').then, 'It does not return then function on a match.');
    assert.isFunction(match('string').includes('petra').then, 'It does not return then function without a match.');
  });
  it('\'With\' should match based on provided regular expression.', () => {
    assert.isTrue(match('string').includes('st').then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match('string').includes('martin').then(true).else(false), 'It does not correctly match.');
  });
});

describe('\'TypeOf\' function test using evaluation based on strict equal.', () => {
  it('Then should be available on both successful and unsuccessful matches.', () => {
    assert.isFunction(match(1).typeOf('number').then, 'It does not return then function on a match.');
    assert.isFunction(match(1).typeOf('string').then, 'It does not return then function without a match.');
  });
  it('\'TypeOf\' should match based on provided regular expression.', () => {
    assert.isTrue(match(1).typeOf('number').then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match(1).typeOf('string').then(true).else(false), 'It does not correctly match.');
  });
});

describe('Various combinations with deep chains are possible.', () => {
  it('It should match correctly under different combinations.', () => {
    assert.strictEqual(match(1).typeOf('number').then('int').equals('string').then('str').else('na'),
      'int', 'It does not evaluate correctly with chaining.');
  });
  it('It should return the first match and ignore correct matches afterwards.', () => {
    assert.strictEqual(match(1).typeOf('number').then('type').equals(1).then('equals').else('na'),
      'type', 'It does not evaluate correctly with chaining.');
  });
});