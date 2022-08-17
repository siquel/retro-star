const commonConfig = require('./jest.config.common')

module.exports = {
  ...commonConfig,
  displayName: 'unit',
  testEnvironment: 'node',
  testRegex: '\\.unit\\.test\\.[jt]s$',
}
