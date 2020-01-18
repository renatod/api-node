import jwt from 'jsonwebtoken'
import HttpStatusError from '../errors/HttpStatusError'

export default (req, res, next) => {
  const header = req.headers.authorization
  if (!header) {
    return next(new HttpStatusError(401, 'Access token was not provided'))
  }

  try {
    const { email } = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    req.loggedUser = { email }
    return next()
  } catch (err) {
    return next(new HttpStatusError(401, 'Invalid access token'))
  }
}
