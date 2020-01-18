import bcrypt from 'bcryptjs'
import User from '../models/User'

class UserService {
  getByEmail(email) {
    return User.findOne({ where: { email: email } })
  }

  checkPassword(user, password) {
    return bcrypt.compare(password, user.password)
  }

  async create(user) {
    const password = await bcrypt.hash(user.password, 8)

    return User.create({
      ...user,
      password
    })
  }
}

export default new UserService()
