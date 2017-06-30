const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cache = require('express-cache-ctrl');
const database = require('./db/knex')

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.json())
app.use('/', cache.disable());

app.set('port', process.env.PORT || 3000)

app.get('/', (request, response) => {
  response.sendFile('index.html')
})

app.get('/api/v1/folders/', (request, response) => {
  database('folders').select()
  .then((folders) => {
    if(folders.length) {
      response.status(200).json( folders)
    } else {
      respsonse.status(404).json({error: 'No folders were found!'})
    }
  })
  .catch(error => response.status(500).json({ error}))
})

app.get('/api/v1/links/', (request, response) => {
  database('links').select()
  .then((links) => {
    if(links.length) {
      response.status(200).json(links)
    } else {
      response.status(404).json({error: 'No links were found!'})
    }
  })
  .catch(error => response.status(500).json({ error}))
})

app.get('/api/v1/folders/:id', (request, response) => {
  database('folders').where('id', request.params.id).select()
  .then((folder) => {
    if(folder.length) {
      response.status(200).json(folder);
    } else {
      response.status(404).json({error:`Could not find folder with id of ${request.params.id}`})
    }
  })
  .catch( error => response.status(500).json({ error }))
})

app.get('/api/v1/folders/:folders_id/links', (request, response) => {
  database('links').where('folders_id', request.params.folders_id).select()
  .then((link) => {
    if(link.length) {
      response.status(200).json(link);
    } else {
      response.status(200).json({note: 'No links exist'})
    }
  })
  .catch( error => response.status(500).json({ error }))
})

app.get('/:short_url',  (request, response) => {
  let clicks
  let url

  database('links').where('short_url', request.params.short_url).select()
  .then(data => {
    console.log(data);
    let link = data[0]
    clicks = link.clicks + 1
    url = link.long_url
  })
  .then(() =>  {
    database('links').where('short_url', request.params.short_url).update('clicks', clicks)
    .then(()=> response.redirect(301, url))
    .catch(error => response.status(404).json({error: `Nothing at ${request.params.short_url}`}))
  })
})

app.post('/api/v1/folders', (request, response) => {
  const folder = request.body;

  for(let requiredParams of ['name']) {
    if(!folder[requiredParams]) {
      return response.status(422).json({error: `Expected format: { name: <string> }. You are missing a ${requiredParams} property`})
    }
  }

  database('folders').insert(folder, 'id', 'name')
  .then((folder) => {
    response.status(201).json({id: folder[0]})
  })
  .catch(error => response.status(500).json({ error }))
})

app.post('/api/v1/links', (request, response) => {
  const link = request.body;

  for(let requiredParams of ['title', 'long_url', 'short_url', 'folders_id']) {
    if(!link[requiredParams]) {
      return response.status(422).json({error: `Expected format: { title: <string>, long_url: <string>, short_url: <string>, folders_id: <integer> }. You are missing a ${requiredParams} property`})
    }
  }

  database('links').insert(link, 'id')
  .then((link) => {
    response.status(201).json({id: link[0]})
  })
  .catch(error => response.status(500).json({ error }))
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})

module.exports = app
