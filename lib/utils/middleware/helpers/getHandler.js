'use strict';

import React from 'react';
import Config from '../../../Config';

var ReactRouter = Config.get('client.router');

export default function (server) {
  return new Promise((resolve, reject) => {
    var Router = createRouter(resolve, reject, server.req.url);

    resolveRoute(Router, server).then(({Handler, state}) => {
      resolve({Handler, state});
    });
  });
};

function createRouter(resolve, reject, url) {
  return ReactRouter.create({
    routes: Config.get('client.routes'),
    location: url,
    onAbort: (aborted) => {
      var {to, params, query} = aborted;
      var url = Router.makePath(to, params, query);

      reject(url);
    }
  });
}

function resolveRoute(Router, server) {
  return new Promise((resolve, reject) => {
    try {
      Router.run(function(Handler, state) {
        resolve({Handler, state});
      });
    }
    catch (err) {
      reject(err);
    }
  }).catch(redirect => {
    server.redirect(redirect);
  });
}
