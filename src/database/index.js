/* eslint-disable import/namespace */
import Sequelize from 'sequelize'
import config from '../config/database'
import * as models from '../models'

const sequelize = new Sequelize(config)

for (const key in models) {
  models[key].init(sequelize)
}

for (const key in models) {
  if (models[key].associate) {
    models[key].associate(sequelize.models)
  }
}

export default sequelize
