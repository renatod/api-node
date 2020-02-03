import AuthService from '../services/Auth'
import UserService from '../services/User'
import HttpStatusError from '../errors/HttpStatusError'

const mapResponse = (item) => {
  return {
    id: item.id,
    email: item.email
  }
}

class AuthController {
  async login(req, res, next) {
    const { email, password } = req.body

    const user = await UserService.getByEmail(email)
    if (user == null || !(await UserService.checkPassword(user, password))) {
      return next(new HttpStatusError(401, 'Email or password invalid.'))
    }

    const accessToken = await AuthService.generateAccessToken(user)

    return res.json({
      user: mapResponse(user),
      accessToken
    })
  }

  async signup(req, res, next) {
    const { email, password } = req.body

    const exists = await UserService.getByEmail(email)
    if (exists !== null) {
      return next(new HttpStatusError(409, 'Email is already in use.'))
    }

    const user = await UserService.create({ email, password })
    const accessToken = await AuthService.generateAccessToken(user)

    return res.json({
      user: mapResponse(user),
      accessToken
    })
  }
}

export default new AuthController()
