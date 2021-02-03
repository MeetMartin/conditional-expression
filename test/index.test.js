import { assert } from 'chai';

const match = process.env.lib === 'prod' ?
  require('../dist/conditional-expression.min').default :
  require('../src').default;

const param = 'this is string';

describe('Match function test.', () => {
  it('Match of anything should return an object.', () => {
    assert.isObject(match(1), 'Match is not an object.');
  });
  it('Then should be available on both successful and unsuccessful matches.', () => {
    assert.isFunction(match(1).on(() => true).then, 'On does not return then function on a match.');
    assert.isFunction(match(1).on(() => false).then, 'On does not return then function without a match.');
  });
  it('Else should provide final evaluation result on both successful and unsuccessful matches.', () => {
    assert.isTrue(match(1).else(true), 'Using only else works.');
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
  it('\'Includes\' should match based on provided string.', () => {
    assert.isTrue(match('string').includes('st').then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match('string').includes('martin').then(true).else(false), 'It does not correctly match.');
  });
  it('\'Includes\' always evaluates as false if a string is not provided to original match.', () => {
    assert.isFalse(match(1).includes('string').then(true).else(false), 'It does not evaluate as false if string is not provided.');
  });
});

describe('\'IsIn\' function test using evaluation based on strict equal.', () => {
  it('Then should be available on both successful and unsuccessful matches.', () => {
    assert.isFunction(match('string').isIn(['string', 'number']).then, 'It does not return then function on a match.');
    assert.isFunction(match('string').isIn(['number', 'boolean']).then, 'It does not return then function without a match.');
  });
  it('\'IsIn\' should match based on provided string or array.', () => {
    assert.isTrue(match('string').isIn(['string', 'number']).then(true).else(false), 'It does not correctly match when param is an array.');
    assert.isFalse(match('string').isIn(['number', 'boolean']).then(true).else(false), 'It does not correctly match when param is an array.');
    assert.isTrue(match('string').isIn('This is a string').then(true).else(false), 'It does not correctly match when param is a string.');
    assert.isFalse(match('string').isIn('This is a number').then(true).else(false), 'It does not correctly match when param is a string.');
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

describe('\'isGreaterThan\' function test comparing sizes.', () => {
  it('Then should be available on both successful and unsuccessful matches.', () => {
    assert.isFunction(match(2).isGreaterThan(1).then, 'It does not return then function on a match.');
    assert.isFunction(match('abc').isGreaterThan('ab').then, 'It does not return then function without a match.');
  });
  it('\'isGreaterThan\' should match based on provided value.', () => {
    assert.isTrue(match(2).isGreaterThan(1).then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match(2).isGreaterThan(2).then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match(2).isGreaterThan(3).then(true).else(false), 'It does not correctly match.');
    assert.isTrue(match('abc').isGreaterThan('ab').then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match('abc').isGreaterThan('abc').then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match('abc').isGreaterThan('abcd').then(true).else(false), 'It does not correctly match.');
  });
});

describe('\'lessThan\' function test comparing sizes.', () => {
  it('Then should be available on both successful and unsuccessful matches.', () => {
    assert.isFunction(match(2).lessThan(1).then, 'It does not return then function on a match.');
    assert.isFunction(match('abc').lessThan('ab').then, 'It does not return then function without a match.');
  });
  it('\'lessThan\' should match based on provided value.', () => {
    assert.isTrue(match(2).lessThan(3).then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match(2).lessThan(2).then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match(2).lessThan(1).then(true).else(false), 'It does not correctly match.');
    assert.isTrue(match('abc').lessThan('abcd').then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match('abc').lessThan('abc').then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match('abc').lessThan('ab').then(true).else(false), 'It does not correctly match.');
  });
});

describe('\'atLeast\' function test comparing sizes.', () => {
  it('Then should be available on both successful and unsuccessful matches.', () => {
    assert.isFunction(match(2).atLeast(1).then, 'It does not return then function on a match.');
    assert.isFunction(match('abc').atLeast('ab').then, 'It does not return then function without a match.');
  });
  it('\'atLeast\' should match based on provided value.', () => {
    assert.isTrue(match(2).atLeast(2).then(true).else(false), 'It does not correctly match.');
    assert.isTrue(match(2).atLeast(2).then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match(2).atLeast(3).then(true).else(false), 'It does not correctly match.');
    assert.isTrue(match('abc').atLeast('ab').then(true).else(false), 'It does not correctly match.');
    assert.isTrue(match('abc').atLeast('abc').then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match('abc').atLeast('abcd').then(true).else(false), 'It does not correctly match.');
  });
});

describe('\'atMost\' function test comparing sizes.', () => {
  it('Then should be available on both successful and unsuccessful matches.', () => {
    assert.isFunction(match(2).atMost(1).then, 'It does not return then function on a match.');
    assert.isFunction(match('abc').atMost('ab').then, 'It does not return then function without a match.');
  });
  it('\'atMost\' should match based on provided value.', () => {
    assert.isTrue(match(2).atMost(3).then(true).else(false), 'It does not correctly match.');
    assert.isTrue(match(2).atMost(2).then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match(2).atMost(1).then(true).else(false), 'It does not correctly match.');
    assert.isTrue(match('abc').atMost('abcd').then(true).else(false), 'It does not correctly match.');
    assert.isTrue(match('abc').atMost('abc').then(true).else(false), 'It does not correctly match.');
    assert.isFalse(match('abc').atMost('ab').then(true).else(false), 'It does not correctly match.');
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
  it('Getting result from match surrounded by false matches should work.', () => {
    assert.isTrue(match(param).includes('notstring').then(false).includes('this').then(true).includes('notstring').then(false).else(false));
  });
});

describe('thenMatch allows for nesting.', () => {
  it('Getting result from nested else should work.', () => {
    assert.isTrue(match(param).includes('string').thenMatch(param).else(true).else(false));
  });
  it('Getting result from nested match should work.', () => {
    assert.isTrue(match(param).includes('string').thenMatch(param).includes('this').then(true).else(false).else(false));
  });
  it('Getting result from nested match sorounded by false matches should work.', () => {
    assert.isTrue(match(param).includes('string').thenMatch(param).includes('notstring').then(false).includes('this').then(true).includes('notstring').then(false).else(false).else(false));
  });
  it('Getting result from match afted false nested match branch should work.', () => {
    assert.isTrue(match(param).includes('notstring').thenMatch(param).includes('this').then(false).else(false).includes('string').then(true).else(false));
  });
  it('Getting result from positive match followed by positive nested match branch should work.', () => {
    assert.isTrue(match(param).includes('string').then(true).includes('this').thenMatch(param).includes('string').then(false).else(false).includes('string').then(false).else(false));
  });
});

describe('Deeper nest matching through using match function as argument to then function.', () => {
  it('Passing result of another match as argument to then function works.', () => {
    assert.isTrue(match(param).includes('string').then(() => match(param).includes('this').then(true).else(false)).else(false));
    assert.isTrue(match(param).includes('string').then(() => match(param).includes('notthis').then(false).else(true)).else(false));
    assert.isTrue(match(param).includes('notstring').then(() => match(param).includes('this').then(false).else(false)).else(true));
  });
  it('Passing result of another match as argument to then function with thenMatch branch works.', () => {
    assert.isTrue(match(param).includes('string').thenMatch(param).includes('this').then(() => match(param).includes('string').then(true).else(false)).else(false).else(false));
  });
});