const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.json())

app.set('port', process.env.PORT || 3000)
app.locals.title = 'jetfuel'

app.locals.folders = {
  one : "I am a folder"
}
app.locals.links = {
  two : "I am a link"
}

app.get('/', (request, response) => {
  response.sendFile('index.html')
})

app.get('/api/folders/:id', (request, response) => {
  const { id } = request.params
  const folder = app.locals.folders[id]
  if (!folder) { return response.sendStatus(404) }
    response.json({
      id, folder
  })
})

app.get('/api/links/:id', (request, response) => {
  const { id } = request.params
  const link = app.locals.links[id]
  if (!link) { return response.sendStatus(404) }
    response.json({
      id, link
  })
})

app.post('/api/folders', (request, response) => {
  const id = Date.now()
  const { folder } = request.body

if (!folder) {
  return response.status(422).send({
    error: 'no message property provided'
  })
}
app.locals.folders[id] = folder
response.status(201).json({ id, folder })
console.log(response.status)
})

app.post('/api/links', (request, response) => {
  const id = Date.now()
  const { link } = request.body

if (!link) {
  return response.status(422).send({
    error: 'no message property provided'
  })
}
app.locals.links[id] = link
response.status(201).json({ id, link })
console.log(response.status)
})


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})
