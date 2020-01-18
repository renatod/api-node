import request from 'supertest'
import app from '../../src/server'
import UserService from '../../src/services/User'
import truncate from '../utils/truncate'

describe('Auth Controller', () => {
  beforeEach(async () => {
    await truncate()
  })

  test('should signup a user', async () => {
    const { status, body } = await request(app)
      .post('/auth/signup')
      .send({
        email: 'signup@gmail.com',
        password: '123456'
      })
    expect(status).toBe(200)

    const user = await UserService.getByEmail('signup@gmail.com')
    expect(user).not.toBeNull()

    expect(body).toHaveProperty('user')
    expect(body).toHaveProperty('accessToken')
    expect(body.user.id).toBe(user.id)
    expect(body.user.email).toBe('signup@gmail.com')
  })

  test('signup should retrieve 409 for "Email is already in use."', async () => {
    await UserService.create({
      email: 'user@gmail.com',
      password: '123456'
    })

    const { status, text } = await request(app)
      .post('/auth/signup')
      .send({
        email: 'user@gmail.com',
        password: '123456'
      })

    expect(status).toBe(409)
    expect(text).toBe('Email is already in use.')
  })

  test('signup should retrieve 422 for invalid data "Invalid e-mail."', async () => {
    const { status, text } = await request(app)
      .post('/auth/signup')
      .send({
        email: 'notAnEmail',
        password: '123456'
      })
    expect(status).toBe(422)
    expect(text).toBe('Invalid e-mail.')
  })

  test('signup should retrieve 422 for invalid data "Password must be at least 6 chars long."', async () => {
    const { status, text } = await request(app)
      .post('/auth/signup')
      .send({
        email: 'email@email.com',
        password: '123'
      })
    expect(status).toBe(422)
    expect(text).toBe('Password must be at least 6 chars long.')
  })

  test('should auth a user', async () => {
    const user = await UserService.create({
      email: 'auth@gmail.com',
      password: 'bvbj8z'
    })

    const { status, body } = await request(app)
      .post('/auth')
      .send({
        email: 'auth@gmail.com',
        password: 'bvbj8z'
      })
    expect(status).toBe(200)
    expect(body).toHaveProperty('user')
    expect(body).toHaveProperty('accessToken')
    expect(body.user.id).toBe(user.id)
    expect(body.user.email).toBe('auth@gmail.com')
  })

  test('login should retrieve 401 "Email or password invalid."', async () => {
    const { status, text } = await request(app)
      .post('/auth')
      .send({
        email: 'xpto',
        password: 'xpto'
      })
    expect(status).toBe(401)
    expect(text).toBe('Email or password invalid.')
  })

  test('should retrieve 401 "Access token was not provided"', async () => {
    const { status, text } = await request(app)
      .get('/customers')
    expect(status).toBe(401)
    expect(text).toBe('Access token was not provided')
  })

  test('should retrieve 401 "Invalid access token"', async () => {
    const { status, text } = await request(app)
      .get('/customers')
      .set('Authorization', 'bla')
    expect(status).toBe(401)
    expect(text).toBe('Invalid access token')
  })
})
