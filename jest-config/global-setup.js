

const dotenv = require("dotenv");


// setup.js
module.exports = async function() {
  console.log("Jest setup")
  console.log("configuring environment variables")
  dotenv.config();

  // conn = await testConn();
  // done();
};

// teardown.js
module.exports = async function() {
  console.log("Jest teardown")
  // await conn.close();
  // done();
};



// beforeAll(async done => {
//   conn = await testConn();
//   done();
// });

// afterAll(async done => {
//   await conn.close();
//   done();
// });