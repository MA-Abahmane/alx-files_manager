/* eslint-disable */
const { MongoClient } = require('mongodb')


class DBClient {

    constructor() {
        // If environment variable are undefined use default values
        const host = process.env.DB_HOST || 'localhost'
        const port = process.env.DB_PORT || 27017
        const database = process.env.DB_DATABASE || 'files_manager'

        const uri = `mongodb://${host}:${port}/${database}`
        this.client = new MongoClient(uri)
        this.client.connect((err) => {
            if (err)
                console.log('Mongo client connect Error:', err)
        })
        this.db = this.client.db()
        this.usersCollection = this.db.collection('users')
        this.filesCollection = this.db.collection('files')
    }

    isAlive() {
        // check is user is online
        return this.client.isConnected()
    }

    async nbUsers() {
        //  returns the number of documents in the collection users
        return this.db.collection('users').countDocuments()
    }

    async nbFiles() {
        // returns the number of documents in the collection files
        return db.collection('files').countDocuments()
    }

}

const dbClient =  new DBClient()
module.exports = dbClient
