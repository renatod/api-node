import Customer from '../models/Customer'
import HttpStatusError from '../errors/HttpStatusError'

class CustomerService {
  findAll({ page, pageSize }) {
    const params = {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [
        ['id', 'ASC']
      ]
    }
    return Customer.findAll(params)
  }

  getByEmail(email) {
    return Customer.findOne({ where: { email: email } })
  }

  getByPk(pk) {
    return Customer.findByPk(pk)
  }

  create(customer) {
    return Customer.create(customer)
  }

  remove(customer) {
    return customer.destroy()
  }

  async update(customer, { name, email }) {
    let needToSave = false
    if (name && customer.name !== name) {
      customer.name = name
      needToSave = true
    }

    if (email && customer.email !== email) {
      const unique = await this.getByEmail(email)
      if (unique !== null) {
        throw new HttpStatusError(409, 'Customer with this email already exists.')
      }
      customer.email = email
      needToSave = true
    }

    if (needToSave) {
      return customer.save()
    } else {
      return customer
    }
  }
}

export default new CustomerService()
