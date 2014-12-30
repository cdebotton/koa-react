'use strict';

import Config from '../../Config';

export default function() {
  return function *(next) {
    if (! Config.get('production')) {
      for (var i in require.cache) {
        if (/^((?!node_modules).)*$/.test(i)) {
          delete require.cache[i];
        }
      }
    }

    yield next;
  };
};
