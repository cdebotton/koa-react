'use strict';

import callsite from 'callsite';
import Config from './Config';
import prepareServer from './utils/prepareServer';

var SERVER = Symbol('koa instance');

export default class KoaReact {
  constructor(params = {}) {
    var stack = callsite();
    Config.load(stack, params);
  }

  createServer() {
    this[SERVER] = prepareServer();

    return this[SERVER];
  }

  server() {
    return this[SERVER];
  }

  setClient(params = {}) {
    Object.keys(params).forEach(key => {
      var property = `client.${key}`;
      Config.set(property, params[key]);
    });
  }

  mount(route, handler) {
    var key = `api.routes.${route}`;
    Config.set(key, handler);
  }
};
