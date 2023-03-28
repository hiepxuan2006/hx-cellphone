const { createConnection, getConnection } = require("./connections/redis");

module.exports = () => {
  createConnection();

  return {
    ...require("./actions/index"),
    getConnection,
  };
};
