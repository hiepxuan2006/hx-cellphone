const Falcon = require('../constants/falcon/Falcon');
const redisURI =
    'redis://redis-18599.c295.ap-southeast-1-1.ec2.cloud.redislabs.com:18599';

console.log('REDIS_URI', redisURI);

const falcon = Falcon();

module.exports = falcon;
