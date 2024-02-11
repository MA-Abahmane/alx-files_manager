/* eslint-disable */
const sha1 = require('sha1')

const dbClient = require('../utils/db')
const redisClient = require('../utils/redis')


const UsersController = {

    async postNew(request, response) {
        const { email, password } = request.body

        if (!email)
            return response.status(400).json({ error: 'Missing email' })

        if (!password) 
            return response.status(400).json({ error: 'Missing password' })

        // check is user with email exists
        const userSearch = await dbClient.usersColl.findOne({ email })
        if (userSearch) 
            return response.status(400).json({ error: 'Already exist' })

        // hash password and save
        const hashedPw = sha1(password)
        // create user
        const newUser = {
            email,
            password: hashedPw,
        }

        try{
            result = await dbClient.usersColl.insertOne(newUser)
        } catch (error) {
            return response.status(400).json({ error: 'Failed to create user' })
        }

        return response.status(201).json({ id: result.insertedId, email, })
    },

    async getMe(request, response) {
        const token = request.headers['x-token']
        if (!token)
            return response.status(401).json({ error: 'Unauthorized' })

        const key = `auth_${token}`
        const userId = await redisClient.get(key)

        if (!userId)
            return response.status(401).json({ error: 'Unauthorized' })

        const user = await dbClient.usersColl.findOne({ _id: userId })

        if (!user) {
            return response.status(401).json({ error: 'Unauthorized' })
        }

        return response.status(200).json({ id: user._id, email: user.email })
    }
}


module.exports = UsersController
