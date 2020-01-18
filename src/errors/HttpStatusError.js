class HttpStatusError extends Error {
  constructor(status, ...params) {
    super(...params)
    this.status = status
  }
}

export default HttpStatusError
