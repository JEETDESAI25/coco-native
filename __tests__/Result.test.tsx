import {result, error, isError, getData, getError} from '../src/types/result';

test('result function returns correct result object', () => {
  const res = result('test data');
  expect(res.data).toBe('test data');
  expect(res.error).toBe('');
});

test('error function returns correct error object', () => {
  const err = error('test error');
  expect(err.data).toBeUndefined();
  expect(err.error).toBe('test error');
});

test('isError function works correctly', () => {
  const res = result('test data');
  const err = error('test error');
  expect(isError(res)).toBe(false);
  expect(isError(err)).toBe(true);
});

test('getData function works correctly', () => {
  const res = result('test data');
  expect(getData(res)).toBe('test data');
  expect(() => getData(error('test error'))).toThrow(
    'tried to get data on erroneous result',
  );
});

test('getError function works correctly', () => {
  const err = error('test error');
  expect(getError(err)).toBe('test error');
  expect(() => getError(result('test data'))).toThrow(
    'tried to get error on valid result',
  );
});
