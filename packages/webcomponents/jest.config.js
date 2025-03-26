module.exports = {
  testEnvironment: 'jest-environment-node',
  testEnvironmentOptions: {
    /* options if any */
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  // other configurations...
};
