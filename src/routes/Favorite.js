import express from 'express'
import { query } from 'express-validator'
import ValidatorHandler from '../middlewares/ValidatorHandler'
import FavoriteController from '../controllers/Favorite'

const routes = express.Router({ mergeParams: true })
routes.get('/', [
  query('page').optional().isInt({ gt: 0 }).withMessage('Invalid page number')], ValidatorHandler, FavoriteController.index)
routes.post('/:identifier', FavoriteController.create)
routes.delete('/:identifier', FavoriteController.remove)

export default routes
