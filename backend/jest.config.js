module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tests/**/*.js',
    '!src/seed/**/*.js'
  ],
  testMatch: [
    '**/src/tests/**/*.js'
  ],
  verbose: true
};