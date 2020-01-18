class FavoriteService {
  findAll(customer, { page, pageSize }) {
    const params = {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [
        ['id', 'ASC']
      ]
    }
    return customer.getProducts(params)
  }

  setFavorite(customer, product) {
    customer.addProducts(product)
  }

  unsetFavorite(customer, product) {
    customer.removeProduct(product)
  }
}

export default new FavoriteService()
