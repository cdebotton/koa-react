'use strict';

import yamlEnvConfig from 'yaml-env-config';
import {fromJS} from 'immutable';
import path from 'path';

const OPTIONS = Symbol('options');

var Config = {
  load(stack, params) {
    var cfgDir = params.config || 'config';
    var file = stack[1].getFileName();
    var dir = path.join(path.dirname(file), cfgDir);
    var config = yamlEnvConfig(dir, {absolute: true});

    this[OPTIONS] = fromJS(config);

    this.set('basedir', path.dirname(file));
    this.set('production', process.env.NODE_ENV === 'production');

    return this;
  },

  get(param = null) {
    if (! param) {
      return this[OPTIONS].toJS();
    }

    var path = param.split('.');

    return this[OPTIONS].getIn(path);
  },

  set(param, value) {
    var path = param.split('.');

    this[OPTIONS] = this[OPTIONS].updateIn(path, oldValue => value);

    return this;
  }
};

export default Config;
