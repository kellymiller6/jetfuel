const express = require('express')
const app = express()
const cache = require('express-cache-ctrl');

const bodyParser = require('body-parser')
const routes = require('./routes/endpoints');


app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.json())
app.use('/', cache.disable());
app.use('/', routes)

app.set('port', process.env.PORT || 3000)

app.get('/', (request, response) => {
  response.sendFile('index.html')
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})

module.exports = app
