import jwt from 'jsonwebtoken'

class AuthService {
  generateAccessToken(user) {
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN)
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn
    })

    return {
      token,
      expiresIn
    }
  }
}

export default new AuthService()
