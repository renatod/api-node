import { Model, DataTypes } from 'sequelize'

class Product extends Model {
  static init(sequelize) {
    super.init({
      identifier: DataTypes.STRING,
      title: DataTypes.STRING,
      image: DataTypes.STRING,
      price: DataTypes.DECIMAL
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsToMany(models.Customer, { foreignKey: 'productId', through: 'Favorites', as: 'Customers' })
  }
}

export default Product
