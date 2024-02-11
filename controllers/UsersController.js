/* eslint-disable */
const sha1 = require('sha1')

const dbClient = require('../utils/db')


const UsersController = {
    
    async postNew(request, response) {
        const { email, password } = request.body

        if (!email)
            return response.status(400).json({ 'error': 'Missing email' })

        if (!password) 
            return response.status(400).json({ 'error': 'Missing password' })

        // check is user with email exists
        const userSearch = await dbClient.getUser({ email })
        if (userSearch) 
            return response.status(400).json({ 'error': 'Already exist' })

        // hash password and save
        const hashedPw = sha1(password)
        
        // create user
        const newUser = {
            email,
            'password': hashedPw,
        }
        // save user
        const createdUser = await dbClient.createUser(newUser)

        return response.status(201).json({ 'id': createdUser._id, 'email': createdUser.email })
    }
}


module.exports = UsersController