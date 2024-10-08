module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: false,
  setupFiles: ["./jest.setup.ts"],
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
};
