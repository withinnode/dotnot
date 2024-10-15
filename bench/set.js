/* eslint-disable max-len,no-console,prefer-arrow-callback */

import { readFile } from 'node:fs/promises';
import { equal as assertEqual } from 'node:assert/strict';
import benchmark from 'benchmark';
import lodashSet from 'lodash.set';
import { setProperty as dotPropSetProperty } from 'dot-prop';
import keypatherSet from 'keypather/set.js';
import mpath from 'mpath';
import { set } from '../lib/index.js';

const { Suite } = benchmark;

const dataStr = await readFile('./bench/data.json', 'utf8');

const data = JSON.parse(dataStr);
const value = 'header';

assertEqual(data.content.children[161].children[1].children[5].properties.className[1], 'footer');

const data1 = JSON.parse(dataStr);
assertEqual(set(data1, 'content.children[161].children[1].children[5].properties.className[1]', value), data1);
assertEqual(data1.content.children[161].children[1].children[5].properties.className[1], value);

const data2 = JSON.parse(dataStr);
assertEqual(lodashSet(data2, 'content.children[161].children[1].children[5].properties.className[1]', value), data2);
assertEqual(data2.content.children[161].children[1].children[5].properties.className[1], value);

const data3 = JSON.parse(dataStr);
assertEqual(dotPropSetProperty(data3, 'content.children[161].children[1].children[5].properties.className[1]', value), data3);
assertEqual(data3.content.children[161].children[1].children[5].properties.className[1], value);

const data4 = JSON.parse(dataStr);
assertEqual(keypatherSet(data4, 'content.children[161].children[1].children[5].properties.className[1]', value), /*data4*/value); // eslint-disable-line spaced-comment
assertEqual(data4.content.children[161].children[1].children[5].properties.className[1], value);

const data5 = JSON.parse(dataStr);
assertEqual(mpath.set('content.children[161].children[1].children[5].properties.className[1]', value, data5), /*data5*/undefined); // eslint-disable-line spaced-comment
assertEqual(data5.content.children[161].children[1].children[5].properties.className[1], value);

console.log('Benchmarking setters...');

new Suite()
  .add('dotnot/set', function () {
    set(data, 'content.children[161].children[1].children[5].properties.className[1]', value);
  })
  .add('lodash.set', function () {
    lodashSet(data, 'content.children[161].children[1].children[5].properties.className[1]', value);
  })
  .add('dot-prop/SetProperty', function () {
    dotPropSetProperty(data, 'content.children[161].children[1].children[5].properties.className[1]', value);
  })
  .add('keypather/set', function () {
    keypatherSet(data, 'content.children[161].children[1].children[5].properties.className[1]', value);
  })
  .add('mpath/set', function () {
    mpath.set('content.children[161].children[1].children[5].properties.className[1]', value, data);
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run();

process.stdout.write('\n');
