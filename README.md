<h1 style='color:royalblue;'>Node.js Cheat Sheet</h1>

## Getting Started with Node.js

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript code outside of a web browser.

### Installation

Run $ npm install when you have the package.json
OR
Download and install Node.js from [nodejs.org](https://nodejs.org/).


### Creating a Simple Node.js Script

```javascript
// hello.js
console.log('Hello, Node.js!');
```

Run the script with:
```bash
node hello.js
```

## Process API

Node.js provides a `process` object which allows you to interact with the current Node.js process.

### Accessing Command Line Arguments

```javascript
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```

### Exiting a Process

```javascript
process.exit(1); // Exit with error code 1
```

## Express.js

Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

### Installation

```bash
npm install express
```

### Basic Example

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

## Mocha

Mocha is a feature-rich JavaScript test framework running on Node.js, making asynchronous testing simple and fun.

### Installation

```bash
npm install --save-dev mocha
```

### Writing a Test

```javascript
const assert = require('assert');

describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.strictEqual([1, 2, 3].indexOf(4), -1);
    });
  });
});
```

## Nodemon

Nodemon is a utility that monitors for changes in your source code and automatically restarts your server.

### Installation

```bash
npm install --save-dev nodemon
```

### Running with Nodemon

```bash
nodemon server.js
```

## MongoDB

MongoDB is a NoSQL database that provides high performance, high availability, and easy scalability.

### Installation

Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community).

### Basic Usage

```javascript
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('mydatabase');
    const collection = database.collection('mycollection');

    // Use MongoDB operations here
  } finally {
    await client.close();
  }
}

run().catch(console.error);
```

## Bull

Bull is a Redis-backed job queue for Node.js, built on top of Redis.

### Installation

```bash
npm install bull
```

### Example Usage

```javascript
const Queue = require('bull');

const queue = new Queue('myQueue');

queue.add({ foo: 'bar' });
```

## Image Thumbnail

Creating image thumbnails is a common task in web development, often performed using image processing libraries like Sharp.

### Example using Sharp

```bash
npm install sharp
```

```javascript
const sharp = require('sharp');

sharp('input.jpg')
  .resize(200, 200)
  .toFile('output.jpg', (err, info) => {
    if (err) throw err;
    console.log(info);
  });
```

## Mime-Types

MIME types are used to identify the types of content that a file contains.

### Example with Node.js

```javascript
const mime = require('mime-types');

const type = mime.lookup('file.txt'); // returns 'text/plain'
```

## Redis

Redis is an open-source, in-memory data structure store used as a database, cache, and message broker.

### Installation

Install Redis from [redis.io](https://redis.io/download).

### Example Usage with Node.js

```javascript
const redis = require('redis');
const client = redis.createClient();

client.set('key', 'value', (err, reply) => {
  console.log(reply); // Output: OK
});

client.get('key', (err, value) => {
  console.log(value); // Output: value
});

client.del('key', (err, value) => {
  console.log(value); // Output: result
});
```