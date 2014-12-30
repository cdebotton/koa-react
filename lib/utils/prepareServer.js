'use strict';

import path from 'path';
import koa from 'koa';
import bodyparser from 'koa-bodyparser';
import compress from 'koa-compress';
import favicon from 'koa-favicon';
import json from 'koa-json'
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

  app.use(middleware.isomorphic());

  return app;
};
