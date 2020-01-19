import HttpStatusError from '../errors/HttpStatusError'

export default (error, req, res, next) => {
  let status = 500
  let message = 'Our team was communicated and we\'ll be working on it.'
  if (error instanceof HttpStatusError) {
    status = error.status
    message = error.message
  } else {
    console.error(error)
  }
  return res.status(status).send(message)
}
