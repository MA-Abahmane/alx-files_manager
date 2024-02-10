const redis = require('redis')
import { promisify } from 'util'


class RedisClient {

    constructor() {
        this.client = redis.createClient()
        // listen for error
        this.client.on('error', (err) => {
            console.log('Redis Client Error', err);
        })

        // Promisify Redis user methods
        this.getAsync = promisify(this.client.get).bind(this.client)
        this.setexAsync = promisify(this.client.setex).bind(this.client)
        this.delAsync = promisify(this.client.del).bind(this.client)
    }

    isAlive() {
        // Check if connection to Redis is a success
        return this.client.connected
    }

    async get(key) {
        // Redis GETTER
        return this.getAsync(key)
    }

    async set(key, value, duration) {
        // Redis SETTER
        return this.setexAsync(key, duration, value)
    }

    async del(key) {
        // Redis DELETE
        return this.delAsync(key)
    }
}


const redisClient = new RedisClient()
module.exports = redisClient
