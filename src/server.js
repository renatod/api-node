import './database'
import express from 'express'
import AuthRoutes from './routes/Auth'
import CustomerRoutes from './routes/Customer'
import FavoriteRoutes from './routes/Favorite'
import Authentication from './middlewares/Authentication'
import ErrorHandler from './middlewares/ErrorHandler'
import NotFoundHandler from './middlewares/NotFoundHandler'

const server = express()
server.use(express.json())
server.use('/auth', AuthRoutes)
server.use('/customers', Authentication, CustomerRoutes)
server.use('/customers/:customer_id/favorites', Authentication, FavoriteRoutes)
server.use(NotFoundHandler)
server.use(ErrorHandler)

export default server
