import { cn } from './utils';

describe('cn utility function', () => {
  it('should handle basic strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
    expect(cn('hello', null, 'world', undefined, '')).toBe('hello world');
  });

  it('should handle conditional class names (objects)', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
    expect(cn('base', { conditional: true, another: false })).toBe('base conditional');
  });

  it('should handle mixed arrays of strings and objects', () => {
    expect(cn(['foo', 'bar'], { baz: true, qux: false }, 'quux')).toBe('foo bar baz quux');
    expect(cn('a', ['b', { c: true, d: false }], 'e')).toBe('a b c e');
  });

  it('should handle null, undefined, and empty values gracefully', () => {
    expect(cn(null)).toBe('');
    expect(cn(undefined)).toBe('');
    expect(cn('')).toBe('');
    expect(cn('foo', null, 'bar')).toBe('foo bar');
    expect(cn({ foo: false, bar: null })).toBe('');
  });

  it('should merge tailwind classes correctly (conceptual test, relies on tailwind-merge)', () => {
    // This test conceptually checks what tailwind-merge should do via cn
    expect(cn('p-4', 'p-2')).toBe('p-2'); // p-2 should override p-4
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500'); // Last conflicting class wins
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4'); // p-4 overrides px-2 and py-1
    expect(cn('m-2 p-2', 'mx-4')).toBe('p-2 mx-4'); // Non-conflicting margins and paddings
  });

  it('should handle complex combinations', () => {
    expect(
      cn(
        'base-class',
        ['array-class1', { 'array-conditional': true }],
        { 'object-conditional': true, 'another-false': false },
        null,
        'another-base'
      )
    ).toBe('base-class array-class1 array-conditional object-conditional another-base');
  });
});
