/* eslint-disable capitalized-comments */

const _split = (s) => {
  const r = [];
  const l = s.length;
  const t = l - 1;

  const charCodeAt = s.charCodeAt.bind(s);
  const push = r.push.bind(r);
  const slice = s.slice.bind(s);

  for (let i = 0, j = i; i < l; i++) {
    const c = charCodeAt(i);

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
      push(slice(j, i));

      j = i + 1;
    }
    // $
    else if (i === t) {
      push(slice(j, l));
    }
  }

  return r;
};

const get = (obj, path, defaultValue) => {
  path = _split(path);

  for (let i = 0; i < path.length; i++) {
    obj = obj[path[i]];
  }

  return obj !== undefined ? obj : defaultValue;
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
