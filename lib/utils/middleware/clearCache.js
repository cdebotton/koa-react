'use strict';

import Config from '../../Config';

export default function() {
  return function *(next) {
    if (! Config.get('production')) {
      [require, require.main.require].forEach(clearCache);
    }

    yield next;
  };
};

function clearCache(localRequire) {
  for (var i in localRequire.cache) {
    if (/^((?!node_modules).)*$/.test(i)) {
      delete localRequire.cache[i];
    }
  }
}
