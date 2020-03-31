const dotenv = require("dotenv");

// setup.js
module.exports = async () => {
  console.log("Jest setup")
  console.log("configuring environment variables")
  dotenv.config();
};
// teardown.js
module.exports = async function() {
  console.log("Jest teardown")
};
