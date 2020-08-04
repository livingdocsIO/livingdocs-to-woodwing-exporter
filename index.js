const express = require('express')
const articles = require('./articles')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.use(cors())
// parse application/json
app.use(bodyParser.json())


app.get('/', (req, res) => res.send('WoodWing Exporter'))
app.post('/articles', articles.create)


if (!module.parent) {
  app.listen(port)
  console.log('Express started on port 3000')
}
