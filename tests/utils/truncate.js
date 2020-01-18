/* eslint-disable import/namespace */
import * as models from '../../src/models'

export default () => {
  return Promise.all(
    Object.keys(models).map(key => models[key].destroy({ truncate: true, force: true }))
  )
}
