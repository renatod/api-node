module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  coverageDirectory: 'tests/coverage',
  clearMocks: true,
  reporters: [
    'default'
  ]
}
