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

  // Add this line to make nanoid (ESM) work with Jest
  transformIgnorePatterns: ['node_modules/(?!nanoid)'],
};
