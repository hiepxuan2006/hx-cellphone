const Falcon = require("../constants/falcon/Falcon");
const redisURI = process.env.MONGODB_URI;

console.log("REDIS_URI", redisURI);

const falcon = Falcon();

module.exports = falcon;
