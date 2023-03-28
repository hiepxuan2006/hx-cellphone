const Confidence = require('confidence')

const config = {
    port: {
        $filter: "env",
        $default: process.env.PORT || 5005,
        production: process.env.PORT || 5005,
    },
    mongodb: {
        $filter: "env",
        $default: process.env.MONGODB_URI || 'mongodb://localhost:27017/tenant_dev',
        production: process.env.MONGODB_URI || 'mongodb://localhost:27017/tenant',
    },
}

const store = new Confidence.Store(config)
const criteria = {
    env: process.env.NODE_ENV || 'development'
}

module.exports = (key, defaultValue = null) => {
    return store.get(key, criteria) || defaultValue
}
