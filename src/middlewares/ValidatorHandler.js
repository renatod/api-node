import { validationResult } from 'express-validator'
import HttpStatusError from '../errors/HttpStatusError'

export default (req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return next(new HttpStatusError(422, result.errors[0].msg))
  }
  next()
}
