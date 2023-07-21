import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { set } from '../lib/index.js';

const dataStr = await readFile('./test/data.json', 'utf8');

let data = null;

describe('dotnot/set', () => {
  beforeEach(() => {
    data = JSON.parse(dataStr);
  });

  describe('standard syntax', () => {
    it('should set by start name', () => {
      set(data, 'and', 'nda');
      assert.equal(data.and, 'nda');
    });

    it('should set by start index', () => {
      set(data.foo, '[1]', 7);
      assert.equal(data.foo[1], 7);
    });

    it('should set by index following name', () => {
      set(data, 'foo[2]', 8);
      assert.equal(data.foo[2], 8);
    });

    it('should set by name following index', () => {
      set(data.foo, '[3].baz', 'fab');
      assert.equal(data.foo[3].baz, 'fab');
    });

    it('should set by index following index', () => {
      set(data.foo, '[4][0]', 81);
      assert.equal(data.foo[4][0], 81);
    });

    it('should set by name following name', () => {
      set(data, 'sun.rum', 91);
      assert.equal(data.sun.rum, 91);
    });

    it('should set by complex chain #1', () => {
      set(data, 'foo[3].bar[1][2].qux.nox', 'box');
      assert.equal(data.foo[3].bar[1][2].qux.nox, 'box');
    });

    it('should set by complex chain #2', () => {
      set(data, 'sun.mop.ned.wol', 53);
      assert.equal(data.sun.mop.ned.wol, 53);
    });

    it('should set by complex chain #3', () => {
      set(data.foo, '[4][1][0][3]', 24);
      assert.equal(data.foo[4][1][0][3], 24);
    });

    it('should return target object for nonexistent name', () => {
      assert.equal(set(data, 'foo.not'), data);
    });

    it('should return target object for nonexistent index', () => {
      assert.equal(set(data, 'foo[99]'), data);
    });

    it('should mutate nothing for invalid path #1', () => {
      set(data, '..', 1);
      assert.deepEqual(data, JSON.parse(dataStr));
    });

    it('should mutate nothing for invalid path #2', () => {
      set(data, '.[', 1);
      assert.deepEqual(data, JSON.parse(dataStr));
    });

    it('should not set __proto__ property', () => {
      const obj = {};

      set(data, '__proto__', obj);

      // eslint-disable-next-line no-proto
      assert.notEqual(data.__proto__, obj);
      assert.notEqual(Object.prototype, obj);
    });

    it('should not set nested __proto__ property', () => {
      const obj = {};

      set(data, 'sun.__proto__', obj);

      // eslint-disable-next-line no-proto
      assert.notEqual(data.sun.__proto__, obj);
      assert.notEqual(Object.prototype, obj);
    });

    it('should not set anything to __proto__ object', () => {
      set(data, '__proto__.pwn', 'pwn');

      // eslint-disable-next-line no-proto
      assert.equal(data.__proto__.pwn, undefined);
      assert.equal(Object.prototype.pwn, undefined);
    });

    it('should not set anything to nested __proto__ object', () => {
      set(data, 'foo.__proto__.pwn', 'pwn');

      // eslint-disable-next-line no-proto
      assert.equal(data.foo.__proto__.pwn, undefined);
      assert.equal(Array.prototype.pwn, undefined);
    });

    it('should mutate nothing for invalid path #3', () => {
      set(data, ']]', 1);
      assert.deepEqual(data, JSON.parse(dataStr));
    });
  });

  describe('dot-only syntax', () => {
    it('should set by start index', () => {
      set(data.foo, '1', 7);
      assert.equal(data.foo[1], 7);
    });

    it('should set by index following name', () => {
      set(data, 'foo.2', 8);
      assert.equal(data.foo[2], 8);
    });

    it('should set by name following index', () => {
      set(data.foo, '3.baz', 'fab');
      assert.equal(data.foo[3].baz, 'fab');
    });

    it('should set by index following index', () => {
      set(data.foo, '4.0', 81);
      assert.equal(data.foo[4][0], 81);
    });

    it('should set by complex chain #1', () => {
      set(data, 'foo.3.bar.1.2.qux.nox', 'box');
      assert.equal(data.foo[3].bar[1][2].qux.nox, 'box');
    });

    it('should set by complex chain #3', () => {
      set(data.foo, '4.1.0.3', 24);
      assert.equal(data.foo[4][1][0][3], 24);
    });

    it('should return target object for nonexistent index', () => {
      assert.equal(set(data, 'foo.99'), data);
    });
  });
});
