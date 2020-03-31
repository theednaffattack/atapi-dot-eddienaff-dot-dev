process.env.PRODUCTION_CLIENT_ORIGIN = "https://at.eddienaff.dev";
process.env.DEVELOPMENT_CLIENT_URI = "http://192.168.1.6:7000/graphql";
process.env.NODE_ENV= "test"

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./jest-config/global-setup.js"
};
