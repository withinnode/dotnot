/* eslint-disable max-len,no-console,prefer-arrow-callback */

import { readFile } from 'node:fs/promises';
import { equal as assertEqual } from 'node:assert/strict';
import benchmark from 'benchmark';
import lodashGet from 'lodash.get';
import { getProperty as dotPropGetProperty } from 'dot-prop';
import dotObject from 'dot-object';
import resolveDotstringkey from 'resolve-dotstringkey';
import keypatherGet from 'keypather/get.js';
import { get } from '../lib/index.js';

const { Suite } = benchmark;

const data = JSON.parse(await readFile('./bench/data.json', 'utf8'));

assertEqual(get(data, 'content.children[161].children[1].children[5].properties.className[1]'), 'footer');
assertEqual(lodashGet(data, 'content.children[161].children[1].children[5].properties.className[1]'), 'footer');
assertEqual(dotPropGetProperty(data, 'content.children[161].children[1].children[5].properties.className[1]'), 'footer');
assertEqual(dotObject.pick('content.children[161].children[1].children[5].properties.className[1]', data), 'footer');
assertEqual(resolveDotstringkey(data, 'content.children[161].children[1].children[5].properties.className[1]'), 'footer');
assertEqual(keypatherGet(data, 'content.children[161].children[1].children[5].properties.className[1]'), 'footer');

console.log('Benchmarking getters...');

new Suite()
  .add('dotnot/get', function () {
    get(data, 'content.children[161].children[1].children[5].properties.className[1]');
  })
  .add('lodash.get', function () {
    lodashGet(data, 'content.children[161].children[1].children[5].properties.className[1]');
  })
  .add('dot-prop/getProperty', function () {
    dotPropGetProperty(data, 'content.children[161].children[1].children[5].properties.className[1]');
  })
  .add('dot-object/pick', function () {
    dotObject.pick('content.children[161].children[1].children[5].properties.className[1]', data);
  })
  .add('resolve-dotstringkey', function () {
    resolveDotstringkey(data, 'content.children[161].children[1].children[5].properties.className[1]');
  })
  .add('keypather/get', function () {
    keypatherGet(data, 'content.children[161].children[1].children[5].properties.className[1]');
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();
