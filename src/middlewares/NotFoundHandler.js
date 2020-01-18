import HttpStatusError from '../errors/HttpStatusError'

export default (req, res, next) => {
  throw new HttpStatusError(404, 'Page not found.')
}
