'use strict';

import path from 'path';
import koa from 'koa';
import bodyparser from 'koa-bodyparser';
import compress from 'koa-compress';
import favicon from 'koa-favicon';
import json from 'koa-json'
import mount from 'koa-mount';
import passport from 'koa-passport';
import session from 'koa-session';
import serveStatic from 'koa-static';
import KeyGrip from 'keygrip';
import requireDir from 'require-dir';
import Config from '../Config';

export default function() {
  var app = require('koa')();
  var middleware = requireDir('./middleware');
  const production = Config.get('production') === true;
  const keys = [Config.get('app.secretKey'), Config.get('app.secretToken')];

  app.keys = new KeyGrip(keys, 'sha256');
  app.use(middleware.responseTime('Response-time'));
  app.use(middleware.errorPropagation());
  app.use(middleware.clearCache());
  app.use(json({pretty: !production}))
  app.use(compress());
  app.use(bodyparser());
  app.use(session(app));
  app.use(serveStatic(
    path.join(
      Config.get('basedir'),
      (Config.get('public') || 'public')
    )
  ));

  var routes = Config.get('api.routes').toObject();
  Object.keys(routes).forEach(route => {
    var Route = routes[route];
    app.use(mount(route, Route.middleware()));
  });

  app.use(middleware.isomorphic());

  return app;
};
