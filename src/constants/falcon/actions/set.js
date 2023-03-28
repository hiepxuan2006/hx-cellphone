const { getConnection } = require("../connections/redis");

module.exports = async (args = {}) => {
  const redis = getConnection();
  console.log(redis);
  const { key, value } = args;
  console.log(args);
  return await redis.set(key, value);
};
