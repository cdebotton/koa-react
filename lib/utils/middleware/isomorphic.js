'use strict';

import React from 'react';
import getHandler from './helpers/getHandler';

export default function isomorphic(routes) {
  return function *(next) {
    var {Handler, state} = yield getHandler(this);
    var markup = React.renderToString(
      <Handler
        params={state.params}
        query={state.query} />
    );

    this.body = `<!doctype html>${markup}`;

    yield next;
  };
};
