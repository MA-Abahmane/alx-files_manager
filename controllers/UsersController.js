/* eslint-disable */
const sha1 = require('sha1')

const dbClient = require('../utils/db')


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
            return response.status(500).json({ error: 'Failed to create user' })
        }

        return response.status(201).json({ id: result.insertedId, email, })
    }
}


module.exports = UsersController
