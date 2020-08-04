
const express = require('express')
var articles = require('./articles')
var cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/articles', articles.create)


if (!module.parent) {
    app.listen(port);
    console.log('Express started on port 3000');
  }