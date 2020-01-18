import server from './server'
server.listen(process.env.PORT || 3000, () => {
  // eslint-disable-next-line no-console
  console.log('API is running!')
})
