/* eslint-disable capitalized-comments */

const _split = (s) => {
  const l = s.length;
  const t = l - 1;
  const r = [];

  for (let i = 0, j = 0; i < l; i++) {
    const c = s.charCodeAt(i);

    // ^.
    // ^[
    // ].
    // ][
    if (j === i && (c === 46 || c === 91)) {
      j++;
    }
    // .
    // [
    // ]
    else if (c === 46 || c === 91 || c === 93) {
      r.push(s.slice(j, i));

      j = i + 1;
    }
    // $
    else if (i === t) {
      r.push(s.slice(j, l));
    }
  }

  return r;
};

const get = (obj, path) => {
  path = _split(path);

  for (let i = 0; i < path.length; i++) {
    obj = obj[path[i]];
  }

  return obj;
};

const set = (obj, path, val) => {
  path = _split(path);

  let ptr = obj;

  for (let i = 0; i < path.length; i++) {
    const prop = path[i];

    if (prop === '') break;
    if (prop === '__proto__') continue;

    // set value
    if (typeof ptr[prop] !== 'object') {
      ptr[prop] = val;

      break;
    }
    // set pointer
    else {
      ptr = ptr[prop];
    }
  }

  return obj;
};

export { get, set };
export default { get, set };
