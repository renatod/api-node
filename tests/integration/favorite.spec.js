import axios from 'axios'
import request from 'supertest'
import app from '../../src/server'
import CustomerService from '../../src/services/Customer'
import ProductService from '../../src/services/Product'
import truncate from '../utils/truncate'
import bearer from '../utils/bearer'

jest.mock('axios')

describe('Favorite Controller', () => {
  beforeEach(async () => {
    await truncate()
  })

  test('should retrieve 404 for unexistent customer id', async () => {
    let response = await request(app)
      .get('/customers/322/favorites')
      .set('Authorization', bearer())
    expect(response.status).toBe(404)

    response = await request(app)
      .post('/customers/322/favorites/xpto')
      .set('Authorization', bearer())
    expect(response.status).toBe(404)

    response = await request(app)
      .delete('/customers/322/favorites/xpto')
      .set('Authorization', bearer())
    expect(response.status).toBe(404)
  })

  test('should retrieve 422 for invalid data "Invalid page number"', async () => {
    const customer = await CustomerService.create({
      name: 'Renato Dias',
      email: 'renatohdias@gmail.com'
    })

    const { status, text } = await request(app)
      .get(`/customers/${customer.id}/favorites?page=A`)
      .set('Authorization', bearer())
    expect(status).toBe(422)
    expect(text).toBe('Invalid page number')
  })

  test('should retrieve empty result', async () => {
    const customer = await CustomerService.create({
      name: 'Renato Dias',
      email: 'renatohdias@gmail.com'
    })

    const { status, body } = await request(app)
      .get(`/customers/${customer.id}/favorites?page=1`)
      .set('Authorization', bearer())
    expect(status).toBe(200)
    expect(body).toHaveProperty('meta')
    expect(body).toHaveProperty('favorites')
    expect(body.favorites.length).toBe(0)
  })

  test('should retrieve 404 for unexistent product id', async () => {
    const customer = await CustomerService.create({
      name: 'Renato Dias',
      email: 'renatohdias@gmail.com'
    })

    let response = await request(app)
      .post(`/customers/${customer.id}/favorites/xpto`)
      .set('Authorization', bearer())
    expect(response.status).toBe(404)
    expect(response.text).toBe('Product not found.')

    response = await request(app)
      .delete(`/customers/${customer.id}/favorites/xpto`)
      .set('Authorization', bearer())
    expect(response.status).toBe(404)
    expect(response.text).toBe('Product not found.')
  })

  test('should favorite a product', async () => {
    const customer = await CustomerService.create({
      name: 'Renato Dias',
      email: 'renatohdias@gmail.com'
    })

    axios.get.mockResolvedValue({
      data: {
        id: 'f6c094e1-f27d-677b-4187-cf6a5acd03aa',
        title: 'Taça para Vinho 1 Peça',
        image: 'http://dbaa0b7d-ddab-8bef-4715-bab2c42b5446.jpg',
        price: 26.63
      }
    })

    const { status } = await request(app)
      .post(`/customers/${customer.id}/favorites/f6c094e1-f27d-677b-4187-cf6a5acd03aa`)
      .set('Authorization', bearer())
    expect(status).toBe(200)

    const product = await ProductService.getByIdentifier('f6c094e1-f27d-677b-4187-cf6a5acd03aa')
    expect(product).not.toBeNull()
  })

  test('should remove a favorite product', async () => {
    const customer = await CustomerService.create({
      name: 'Renato Dias',
      email: 'renatohdias@gmail.com'
    })

    axios.get.mockResolvedValue({
      data: {
        id: 'faee40cb-7481-2805-da9c-1baaee309ec1',
        title: 'Alaïa Paris Perfume Feminino',
        image: 'http://dbaa0b7d-ddab-8bef-4715-bab2c42b5446.jpg',
        price: 26.63
      }
    })

    const product = await ProductService.getByIdentifier('faee40cb-7481-2805-da9c-1baaee309ec1')
    expect(product).not.toBeNull()

    const { status } = await request(app)
      .delete(`/customers/${customer.id}/favorites/faee40cb-7481-2805-da9c-1baaee309ec1`)
      .set('Authorization', bearer())
    expect(status).toBe(200)
  })

  test('should retrieve result', async () => {
    const customer = await CustomerService.create({
      name: 'Renato Dias',
      email: 'renatohdias@gmail.com'
    })

    axios.get.mockResolvedValue({
      data: {
        id: 'faee40cb',
        title: 'My Product',
        image: 'http://bab2c42b5446.jpg',
        price: 11.63
      }
    })

    const product = await ProductService.getByIdentifier('faee40cb')
    expect(product).not.toBeNull()

    await customer.addProduct(product)

    const { status, body } = await request(app)
      .get(`/customers/${customer.id}/favorites`)
      .set('Authorization', bearer())
    expect(status).toBe(200)
    expect(body).toHaveProperty('meta')
    expect(body).toHaveProperty('favorites')
    expect(body.favorites.length).toBe(1)
    expect(body.favorites[0].id).toBe('faee40cb')
    expect(body.favorites[0].title).toBe('My Product')
    expect(body.favorites[0].image).toBe('http://bab2c42b5446.jpg')
    expect(body.favorites[0].price).toBe(11.63)
  })
})
