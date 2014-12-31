'use strict';

import Config from '../../Config';

export default function errorPropagation() {
  return function *(next) {
    try {
      yield next;
      var status = this.status || 404;
      if (status === 404 && !this.body) this.throw(404);
    }
    catch (err) {
      err.status = err.status || 500;
      err.message = !Config.get('production') ?
        err.stack :
        'Internal server error';

      this.status = err.status;
      this.body = err.message;
      this.app.emit('error', err, this);
    }
  };
}
