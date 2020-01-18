import request from 'supertest'
import app from '../../src/server'
import CustomerService from '../../src/services/Customer'
import truncate from '../utils/truncate'
import bearer from '../utils/bearer'

describe('Customer Controller', () => {
  beforeEach(async () => {
    await truncate()
  })

  test('should retrieve empty result', async () => {
    const { status, body } = await request(app)
      .get('/customers')
      .set('Authorization', bearer())
    expect(status).toBe(200)
    expect(body).toHaveProperty('meta')
    expect(body).toHaveProperty('customers')
    expect(body.customers.length).toBe(0)
  })

  test('should retrieve one result', async () => {
    await CustomerService.create({
      name: 'Renato Dias',
      email: 'renatohdias@gmail.com'
    })

    const { status, body } = await request(app)
      .get('/customers')
      .set('Authorization', bearer())
    expect(status).toBe(200)
    expect(body).toHaveProperty('meta')
    expect(body.meta.page).toBe(1)
    expect(body.meta.pageSize).toBe(10)
    expect(body).toHaveProperty('customers')
    expect(body.customers.length).toBe(1)
    expect(body.customers[0].name).toBe('Renato Dias')
    expect(body.customers[0].email).toBe('renatohdias@gmail.com')
  })

  test('should retrieve no result for page 2', async () => {
    await CustomerService.create({
      name: 'Renato Dias',
      email: 'renatohdias@gmail.com'
    })

    const { status, body } = await request(app)
      .get('/customers?page=2')
      .set('Authorization', bearer())
    expect(status).toBe(200)
    expect(body).toHaveProperty('meta')
    expect(body.meta.page).toBe('2')
    expect(body.meta.pageSize).toBe(10)
    expect(body).toHaveProperty('customers')
    expect(body.customers.length).toBe(0)
  })

  test('should retrieve 404 for unexistent customer id', async () => {
    const { status } = await request(app)
      .get('/customers/322')
      .set('Authorization', bearer())
    expect(status).toBe(404)
  })

  test('should retrieve 404 for wrong customer path', async () => {
    const { status } = await request(app)
      .get('/customer')
      .set('Authorization', bearer())
    expect(status).toBe(404)
  })

  test('should retrieve the customer details', async () => {
    const customer = await CustomerService.create({
      name: 'Customer Name',
      email: 'email@gmail.com'
    })

    const { status, body } = await request(app)
      .get(`/customers/${customer.id}`)
      .set('Authorization', bearer())
    expect(status).toBe(200)
    expect(body.id).toBe(customer.id)
    expect(body.name).toBe(customer.name)
    expect(body.email).toBe(customer.email)
  })

  test('should create a new customer', async () => {
    let customer = await CustomerService.getByEmail('email@gmail.com')
    expect(customer).toBeNull()

    const { status, body } = await request(app)
      .post('/customers')
      .set('Authorization', bearer())
      .send({
        name: 'Renato',
        email: 'email@gmail.com'
      })
    expect(status).toBe(200)
    expect(body.name).toBe('Renato')
    expect(body.email).toBe('email@gmail.com')

    customer = await CustomerService.getByEmail('email@gmail.com')
    expect(customer).not.toBeNull()
  })

  test('should retrieve 409 for "Customer already exists."', async () => {
    await CustomerService.create({
      name: 'Customer Name',
      email: 'already@gmail.com'
    })

    const { status, text } = await request(app)
      .post('/customers')
      .set('Authorization', bearer())
      .send({
        name: 'Renato',
        email: 'already@gmail.com'
      })
    expect(status).toBe(409)
    expect(text).toBe('Customer already exists.')
  })

  test('should delete a Customer', async () => {
    const customer = await CustomerService.create({
      name: 'Customer To Delete',
      email: 'delete@gmail.com'
    })

    const { status, body } = await request(app)
      .delete(`/customers/${customer.id}`)
      .set('Authorization', bearer())
    expect(status).toBe(200)
    expect(body.id).toBe(customer.id)
    expect(body.name).toBe(customer.name)
    expect(body.email).toBe(customer.email)
  })

  test('should retrive 404 for deleting an inexistent customer', async () => {
    const { status, text } = await request(app)
      .delete('/customers/xpto')
      .set('Authorization', bearer())
    expect(status).toBe(404)
    expect(text).toBe('Customer not found.')
  })

  test('should update a Customer', async () => {
    const customer = await CustomerService.create({
      name: 'Customer To Update',
      email: 'customer@gmail.com'
    })

    const { status, body } = await request(app)
      .put(`/customers/${customer.id}`)
      .set('Authorization', bearer())
      .send({
        name: 'New Customer Name',
        email: 'new@gmail.com'
      })
    expect(status).toBe(200)
    expect(body.id).toBe(customer.id)
    expect(body.name).toBe('New Customer Name')
    expect(body.email).toBe('new@gmail.com')
  })

  test('should update a Customer with the same values', async () => {
    const customer = await CustomerService.create({
      name: 'Customer To Update',
      email: 'customer@gmail.com'
    })

    const { status, body } = await request(app)
      .put(`/customers/${customer.id}`)
      .set('Authorization', bearer())
      .send({
        name: 'Customer To Update',
        email: 'customer@gmail.com'
      })
    expect(status).toBe(200)
    expect(body.id).toBe(customer.id)
    expect(body.name).toBe('Customer To Update')
    expect(body.email).toBe('customer@gmail.com')
  })

  test('should retrive 404 for "Customer not found."', async () => {
    const { status, text } = await request(app)
      .put('/customers/xpto')
      .set('Authorization', bearer())
      .send({
        name: 'New Customer Name',
        email: 'new@gmail.com'
      })
    expect(status).toBe(404)
    expect(text).toBe('Customer not found.')
  })

  test('should retrive 409 for "Customer with this email already exists."', async () => {
    const customerA = await CustomerService.create({
      name: 'Customer A',
      email: 'customera@gmail.com'
    })

    await CustomerService.create({
      name: 'Customer B',
      email: 'customerb@gmail.com'
    })

    const { status, text } = await request(app)
      .put(`/customers/${customerA.id}`)
      .set('Authorization', bearer())
      .send({
        email: 'customerb@gmail.com'
      })
    expect(status).toBe(409)
    expect(text).toBe('Customer with this email already exists.')
  })

  test('should retrieve 422 for invalid data "Invalid E-mail" on creation', async () => {
    const { status, text } = await request(app)
      .post('/customers')
      .set('Authorization', bearer())
      .send({
        name: 'Invalid Customer Email',
        email: 'notAnEmail'
      })
    expect(status).toBe(422)
    expect(text).toBe('Invalid E-mail')
  })

  test('should retrieve 422 for invalid data "Name must be at least 3 chars long"', async () => {
    const customer = await CustomerService.create({
      name: 'Customer with a valid Name',
      email: 'customer@gmail.com'
    })

    const { status, text } = await request(app)
      .put(`/customers/${customer.id}`)
      .set('Authorization', bearer())
      .send({
        name: 'Na'
      })
    expect(status).toBe(422)
    expect(text).toBe('Name must be at least 3 chars long')
  })

  test('should retrieve 422 for invalid data "Invalid page number"', async () => {
    const { status, text } = await request(app)
      .get('/customers?page=A')
      .set('Authorization', bearer())
    expect(status).toBe(422)
    expect(text).toBe('Invalid page number')
  })
})
