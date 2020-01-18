import { Model, DataTypes } from 'sequelize'

class User extends Model {
  static init(sequelize) {
    super.init({
      email: DataTypes.STRING,
      password: DataTypes.STRING
    }, {
      sequelize
    })
  }
}

export default User
