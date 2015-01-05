'use strict';

import React from 'react';
import getHandler from './helpers/getHandler';
import fetchData from './helpers/fetchData';

export default function isomorphic() {
  return function *(next) {
    var {Handler, state} = yield getHandler(this);
    var {routes, params, query} = state;
    var data = yield fetchData(routes, params, query);
    var markup = React.renderToString(
      <Handler
        params={params}
        query={query} />
    );

    this.body = `<!doctype html>${markup}`;

    yield next;
  };
};
