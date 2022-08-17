const commonConfig = require('./jest.config.common')
module.exports = {
  ...commonConfig,
  displayName: 'integration',
  testEnvironment: 'node',
  testRegex: '.*(?<!unit)\\.test\\.[jt]sx?$',
}
