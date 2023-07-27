# DotNot - Dot notation getter and setter

[RU](README.ru.md) | EN

DotNot <sup>(not to be confused with .NET)</sup> - is a JavaScript library for accessing deeply nested properties of objects using path strings. It can work with the Node.js and web browsers. Optimized primarly for v8, but should perform well in other JavaScript engines too.

Quick example:

```js
// Load library directly from npm into browser
const { get } = await import('https://unpkg.com/@withinnode/dotnot@1.0.0/lib/index.js');

// Then look for your preferred language
get(window, 'navigator.languages[0]'); // ru
```

## Installation

This package has no runtime dependencies, so for production use you better install it without devDependencies:

```
npm install --omit=dev @withinnode/dotnot
```

If you plan to run benchmarks on your system, you will need devDependencies, so install the package as always:

```
npm install @withinnode/dotnot
```

## Usage

DotNot support standard JavaScript [property accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) syntax with dots and brackets as well as dot-only notation.

```js
// You can import get or set or both
import { get, set } from 'dotnot';

// The example object for access
const obj = {
  foo: {
    bar: ['baz', { qux: 42 }]
  }
};

// Get values by standard syntax
get(obj, 'foo.bar[0]'); // baz
get(obj, 'foo.bar[1].qux'); // 42

// Set a new values
set(obj, 'foo.bar[0]', 'zab');
set(obj, 'foo.bar[1].qux', 24);

// Get values by dot-only notation
get(obj, 'foo.bar.0'); // zab
get(obj, 'foo.bar.1.qux'); // 24
```

## API

### ES Module

The `dotnot` module has named exports `get`, `set` and `default` export object with them set as methods.

To import default object use:

```js
import dotnot from 'dotnot';

// dotnot.get()
// dotnot.set()
```

To import by name use:

```js
import { get, set } from 'dotnot';

// get()
// set()
```

### get(obj: object, path: string, defaultValue?: any): any

Function `get` is a getter and used to get value of a property of an object by path to that property.

Arguments:

  * `obj`: _object_ - Target object
  * `path`: _string_ - Path to property
  * `defaultValue`: _any_ - Value returned if requested property is not defined

Returns:

  * Value of found property or default value (if provided) or `undefined` if property was not found.

### set(obj: object, path: string, value: any): object

Function `set` is a setter and used to set value of a property of an object by path to that property.

Arguments:

  * `obj`: _object_ - Target object
  * `path`: _string_ - Path to property
  * `value`: _any_ - Value to set

Returns:

  * Reference to passed object that was mutated or `undefined` if property was not found.

## Performance

For representative benchmarks I took only packages that support full JS accessor syntax with dots for properties and brackets for array indexes. Dot-only paths is not a primary goal for this library, however it could be made much more faster.

Comparison to main competitors:

```
Benchmarking getters...
dotnot/get x 1,616,082 ops/sec ±0.17% (99 runs sampled)
lodash.get x 414,361 ops/sec ±0.10% (98 runs sampled)
dot-prop/getProperty x 385,361 ops/sec ±0.17% (98 runs sampled)
dot-object/pick x 528,419 ops/sec ±0.09% (94 runs sampled)
resolve-dotstringkey x 377,465 ops/sec ±0.37% (98 runs sampled)
keypather/get x 185,867 ops/sec ±0.10% (97 runs sampled)
mpath/get x 564,499 ops/sec ±0.14% (95 runs sampled)
Fastest is dotnot/get

Benchmarking setters...
dotnot/set x 1,338,293 ops/sec ±0.13% (97 runs sampled)
lodash.set x 348,360 ops/sec ±0.43% (96 runs sampled)
dot-prop/SetProperty x 408,039 ops/sec ±0.07% (99 runs sampled)
keypather/set x 179,563 ops/sec ±0.33% (99 runs sampled)
mpath/set x 546,170 ops/sec ±0.08% (95 runs sampled)
Fastest is dotnot/set
```

Note, that in this benchmark lodash' get/set functions were [patched](patches/) to not use memoization of path resolver, because there is no interest to benchmark a cache. But if you really wish to, here is the results with [memoize](https://lodash.com/docs/4.17.15#memoize):

```
Benchmarking getters...
dotnot/get x 9,821,512 ops/sec ±0.14% (97 runs sampled)
lodash.get x 5,354,197 ops/sec ±0.56% (96 runs sampled)
Fastest is dotnot/get

Benchmarking setters...
dotnot/set x 4,363,587 ops/sec ±0.25% (98 runs sampled)
lodash.set x 2,021,528 ops/sec ±0.26% (98 runs sampled)
Fastest is dotnot/get
```

Why DotNot is still 2x faster? That's because of logic besides the path resolver, although it's just a loop, DotNot's one is still better optimized.

## Development

The library's code is manually crafted with a focus on performance when executing on v8 - the default engine for Node.js. During the optimization stage was heavily used such technique as analysis of bytecode and assembler instructions, generated by interpreter and compilers for x86-64 platform. Right now, the other engines and platforms are not significant for this project, so targeted optimization for them is not performed.

## License

This software is distirbuted under the [MIT license](LICENSE) and free for use in private or commercial projects.
