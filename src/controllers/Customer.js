import { validationResult } from 'express-validator'
import CustomerService from '../services/Customer'
import HttpStatusError from '../errors/HttpStatusError'

const mapResponse = (item) => {
  return {
    id: item.id,
    name: item.name,
    email: item.email
  }
}

class CustomerController {
  async index(req, res, next) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return next(new HttpStatusError(422, result.errors[0].msg))
    }

    const paging = {
      page: req.query.page || 1,
      pageSize: 10
    }

    const customers = await CustomerService.findAll(paging).map(mapResponse)
    return res.json({
      meta: {
        ...paging
      },
      customers
    })
  }

  async details(req, res, next) {
    const customer = await CustomerService.getByPk(req.params.id)
    if (customer == null) {
      return next(new HttpStatusError(404, 'Customer not found.'))
    }

    return res.json(mapResponse(customer))
  }

  async create(req, res, next) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return next(new HttpStatusError(422, result.errors[0].msg))
    }

    const { name, email } = req.body

    const exists = await CustomerService.getByEmail(email)
    if (exists !== null) {
      return next(new HttpStatusError(409, 'Customer already exists.'))
    }

    const customer = await CustomerService.create({ name, email })
    return res.json(mapResponse(customer))
  }

  async update(req, res, next) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return next(new HttpStatusError(422, result.errors[0].msg))
    }

    const customer = await CustomerService.getByPk(req.params.id)
    if (customer == null) {
      return next(new HttpStatusError(404, 'Customer not found.'))
    }

    try {
      const result = await CustomerService.update(customer, req.body)
      return res.json(mapResponse(result))
    } catch (error) {
      return next(error)
    }
  }

  async delete(req, res, next) {
    const customer = await CustomerService.getByPk(req.params.id)
    if (customer == null) {
      return next(new HttpStatusError(404, 'Customer not found.'))
    }

    await CustomerService.remove(customer)
    return res.json(mapResponse(customer))
  }
}

export default new CustomerController()
