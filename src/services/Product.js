import Product from '../models/Product'
import ExternalProductService from './ExternalProduct'

class ProductService {
  async getByIdentifier(identifier) {
    const product = await Product.findOne({ where: { identifier: identifier } })
    if (product !== null) {
      return product
    }

    // Load from public API
    const data = await ExternalProductService.loadProductFromApi(identifier)
    if (data == null) {
      return null
    }

    return Product.create(data)
  }
}

export default new ProductService()
