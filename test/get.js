import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { get } from '../lib/index.js';

const data = JSON.parse(await readFile('./test/data.json', 'utf8'));

describe('dotnot/get', () => {
  describe('standard syntax', () => {
    it('should get by start name', () => {
      assert.equal(get(data, 'and'), 'dna');
    });

    it('should get by start index', () => {
      assert.equal(get(data.foo, '[1]'), 6);
    });

    it('should get by index following name', () => {
      assert.equal(get(data, 'foo[2]'), 7);
    });

    it('should get by name following index', () => {
      assert.equal(get(data.foo, '[3].baz'), 'zab');
    });

    it('should get by index following index', () => {
      assert.equal(get(data.foo, '[4][0]'), 18);
    });

    it('should get by name following name', () => {
      assert.equal(get(data, 'sun.rum'), 19);
    });

    it('should get by complex chain #1', () => {
      assert.equal(get(data, 'foo[3].bar[1][2].qux.nox'), 'xon');
    });

    it('should get by complex chain #2', () => {
      assert.equal(get(data, 'sun.mop.ned.wol'), 35);
    });

    it('should get by complex chain #3', () => {
      assert.equal(get(data.foo, '[4][1][0][3]'), 42);
    });

    it('should return undefined for nonexistent name', () => {
      assert.equal(get(data, 'foo.not'), undefined);
    });

    it('should return undefined for nonexistent index', () => {
      assert.equal(get(data, 'foo[99]'), undefined);
    });

    it('should return default value for undefined property', () => {
      assert.equal(get(data, 'foo.not', 'pot'), 'pot');
    });

    it('should throw error for invalid path', () => {
      assert.throws(() => get(data, ']]'));
    });
  });

  describe('dot-only syntax', () => {
    it('should get by start index', () => {
      assert.equal(get(data.foo, '1'), 6);
    });

    it('should get by index following name', () => {
      assert.equal(get(data, 'foo.2'), 7);
    });

    it('should get by name following index', () => {
      assert.equal(get(data.foo, '3.baz'), 'zab');
    });

    it('should get by index following index', () => {
      assert.equal(get(data.foo, '4.0'), 18);
    });

    it('should get by complex chain #1', () => {
      assert.equal(get(data, 'foo.3.bar.1.2.qux.nox'), 'xon');
    });

    it('should get by complex chain #3', () => {
      assert.equal(get(data.foo, '4.1.0.3'), 42);
    });

    it('should return undefined for nonexistent index', () => {
      assert.equal(get(data, 'foo.99'), undefined);
    });
  });
});
