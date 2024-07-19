module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  coverageDirectory: '../coverage',
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\/]+$"
  ]
};
