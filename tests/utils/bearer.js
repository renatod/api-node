import AuthService from '../../src/services/Auth'

export default () => {
  const accessToken = AuthService.generateAccessToken({
    email: 'Dummy@gmail.com'
  })
  return `Bearer ${accessToken.token}`
}
