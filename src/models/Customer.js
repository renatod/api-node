import { Model, DataTypes } from 'sequelize'

class Customer extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      email: DataTypes.STRING
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsToMany(models.Product, { foreignKey: 'customerId', through: 'Favorites', as: 'Products' })
  }
}

export default Customer
