import axios from 'axios'

class ExternalProductService {
  async loadProductFromApi(identifier) {
    try {
      const { data } = await axios.get(`${process.env.API_HOST}/product/${identifier}`)
      return {
        identifier: data.id,
        title: data.title,
        image: data.image,
        price: data.price
      }
    } catch {
      return null
    }
  }
}

export default new ExternalProductService()
