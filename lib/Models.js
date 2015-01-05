"use strict";

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import Config from './Config';

var config = Config.get('database');
var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);
var db = {};

var modelPath = path.join(
  Config.get('app.basedir'),
  Config.get('database.models')
);

fs.readdirSync(modelPath)
  .filter(file => file.indexOf(".") !== 0)
  .forEach(file => {
    var model = sequelize["import"](path.join(modelPath, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
