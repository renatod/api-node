import express from 'express'
import { body } from 'express-validator'
import ValidatorHandler from '../middlewares/ValidatorHandler'
import AuthController from '../controllers/Auth'

const routes = express.Router()
routes.post('/', AuthController.login)
routes.post('/signup', [
  body('email')
    .isEmail()
    .withMessage('Invalid e-mail.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 chars long.')], ValidatorHandler, AuthController.signup)

export default routes
