import { validationResult } from 'express-validator'
import CustomerService from '../services/Customer'
import ProductService from '../services/Product'
import FavoriteService from '../services/Favorite'
import HttpStatusError from '../errors/HttpStatusError'

const mapResponse = (item) => {
  return {
    id: item.identifier,
    title: item.title,
    image: item.image,
    price: item.price
  }
}

class FavoriteController {
  async index(req, res, next) {
    const customer = await CustomerService.getByPk(req.params.customer_id)
    if (customer == null) {
      return next(new HttpStatusError(404, 'Customer not found.'))
    }

    const result = validationResult(req)
    if (!result.isEmpty()) {
      return next(new HttpStatusError(422, result.errors[0].msg))
    }

    const paging = {
      page: req.query.page || 1,
      pageSize: 10
    }

    const products = await FavoriteService.findAll(customer, paging).map(mapResponse)
    return res.json({
      meta: {
        ...paging
      },
      favorites: products
    })
  }

  async create(req, res, next) {
    const customer = await CustomerService.getByPk(req.params.customer_id)
    if (customer == null) {
      return next(new HttpStatusError(404, 'Customer not found.'))
    }

    const product = await ProductService.getByIdentifier(req.params.identifier)
    if (product == null) {
      return next(new HttpStatusError(404, 'Product not found.'))
    }

    await FavoriteService.setFavorite(customer, product)
    return res.json(mapResponse(product))
  }

  async remove(req, res, next) {
    const customer = await CustomerService.getByPk(req.params.customer_id)
    if (customer == null) {
      return next(new HttpStatusError(404, 'Customer not found.'))
    }

    const product = await ProductService.getByIdentifier(req.params.identifier)
    if (product == null) {
      return next(new HttpStatusError(404, 'Product not found.'))
    }

    await FavoriteService.unsetFavorite(customer, product)
    return res.json(mapResponse(product))
  }
}

export default new FavoriteController()
