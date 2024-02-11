/* eslint-disable */
const sha1 = require('sha1')
const { v4: uuidv4 } = require('uuid');

const dbClient = require('../utils/db')
const redisClient = require('../utils/redis')


const AuthController = {

    async getConnect(request, response) {
        const authHeader = request.headers['authorization'] || null
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return response.status(401).json({ error: 'Unauthorized' })
        }

        const credentials_base64 = authHeader.split(' ')[1]
        const credentials = Buffer.from(credentials_base64, 'base64').toString('UTF-8')

        const [email, password] = credentials.split(':')
        if (!email || !password)
            return response.status(401).json({ error: 'Unauthorized' })

        const user = await dbClient.usersColl.findOne({ email, password: sha1(password) })
        if (!user)
            return response.status(401).json({ error: 'Unauthorized' })

        const token = uuidv4()
        const key = `auth_${token}`

        await redisClient.set(key, user._id.toString(), 24 * 3600)
        return response.status(200).json({ "token": token })

    },

    async getDisconnect(request, response) {
        const token = request.headers['x-token']
        if (!token)
            return response.status(401).json({ error: 'Unauthorized' })

        const key = `auth_${token}`
        
        const userId = await redisClient.get(key)
        if (!userId)
            return response.status(401).json({ error: 'Unauthorized' })

        redisClient.del(key)
        return response.status(204).send()
    }

}


module.exports = AuthController