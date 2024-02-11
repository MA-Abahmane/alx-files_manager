/* eslint-disable */
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

const dbClient = require('../utils/db')
const redisClient = require('../utils/redis')

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager'


const FilesController = {

    async postUpload(request, response) {
        try {
            const token = request.headers['x-token']
            if (!token)
                return response.status(401).json({ error: 'Unauthorized' })

            const key = `auth_${token}`
            const userId = await redisClient.get(key)

            if (!userId)
                return response.status(401).json({ error: 'Unauthorized' })

            const { name, type, parentId = 0, isPublic = false, data } = request.body

            if (!name)
                return response.status(400).json({ error: 'Missing name' })

            if (!type || !['folder', 'file', 'image'].includes(type))
                return response.status(400).json({ error: 'Missing type or invalid type' })

            if (type !== 'folder' && !data)
                return response.status(400).json({ error: 'Missing data' })

            let parentFile
            if (parentId !== 0) {
                parentFile = await dbClient.filesColl.findOne({ _id: parentId })
                if (!parentFile) {
                    return response.status(400).json({ error: 'Parent not found' })
                }
                if (parentFile.type !== 'folder') {
                    return response.status(400).json({ error: 'Parent is not a folder' })
                }
            }

            const fileDocument = {
                userId,
                name,
                type,
                parentId,
                isPublic,
            }

            if (type === 'folder') {
                const result = await dbClient.filesColl.insertOne(fileDocument)
                return response.status(201).json(result.ops[0])
            } else {
                const fileData = Buffer.from(data, 'base64')
                const fileId = uuid.v4()
                const filePath = path.join(FOLDER_PATH, fileId)

                fs.writeFileSync(filePath, fileData)

                fileDocument.localPath = filePath

                if (parentFile) {
                    fileDocument.path = `${parentFile.path}/${fileId}`
                } else {
                    fileDocument.path = fileId
                }

                const result = await dbClient.filesColl.insertOne(fileDocument)
                return response.status(201).json(result.ops[0])
            }
        } catch (error) {
            console.error('Error uploading file:', error)
            return response.status(500).json({ error: 'Internal Server Error' })
        }
    },

    async getShow(request, response) {
        try {
            const token = request.headers['x-token'];
            if (!token)
                return response.status(401).json({ error: 'Unauthorized' });

            const key = `auth_${token}`;
            const userId = await redisClient.get(key);

            if (!userId)
                return response.status(401).json({ error: 'Unauthorized' });

            const fileId = request.params.id;

            const file = await dbClient.filesColl.findOne({ _id: fileId, userId });

            if (!file)
                return response.status(404).json({ error: 'Not found' });

            return response.json(file);
        } catch (error) {
            console.error('Error getting file:', error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getIndex(request, response) {
        try {
            const token = request.headers['x-token'];
            if (!token)
                return response.status(401).json({ error: 'Unauthorized' });

            const key = `auth_${token}`;
            const userId = await redisClient.get(key);

            if (!userId)
                return response.status(401).json({ error: 'Unauthorized' });

            const { parentId = '0', page = 0 } = request.query;
            const limit = 20;
            const skip = page * limit;

            const files = await dbClient.filesColl
                .find({ userId, parentId })
                .skip(skip)
                .limit(limit)
                .toArray();

            return response.json(files);
        } catch (error) {
            console.error('Error getting files:', error);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }

}

module.exports = FilesController
