import express from 'express'
import { check, query } from 'express-validator'
import ValidatorHandler from '../middlewares/ValidatorHandler'
import CustomerController from '../controllers/Customer'

const routes = express.Router()
routes.get('/', [
  query('page').optional().isInt({ gt: 0 }).withMessage('Invalid page number')], ValidatorHandler, CustomerController.index)
routes.get('/:id', CustomerController.details)
routes.post('/', [
  check('email')
    .isEmail()
    .withMessage('Invalid E-mail'),
  check('name')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 chars long')], ValidatorHandler, CustomerController.create)
routes.put('/:id', [
  check('email')
    .optional()
    .isEmail()
    .withMessage('Invalid E-mail'),
  check('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 chars long')], ValidatorHandler, CustomerController.update)
routes.delete('/:id', CustomerController.delete)

export default routes
