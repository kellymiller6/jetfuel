const database = require('../db/knex')

const getAllFolders = (request, response) => {
  database('folders').select()
  .then((folders) => {
    if(folders.length) {
      response.status(200).json( folders)
    } else {
      respsonse.status(404).json({error: 'No folders were found!'})
    }
  })
  .catch(error => response.status(500).json({ error}))
}

const getAllLinks = (request, response) => {
  database('links').select()
  .then((links) => {
    if(links.length) {
      response.status(200).json(links)
    } else {
      response.status(404).json({error: 'No links were found!'})
    }
  })
  .catch(error => response.status(500).json({ error}))
}

const getFolderById = (request, response) => {
  database('folders').where('id', request.params.id).select()
  .then((folder) => {
    if(folder.length) {
      response.status(200).json(folder);
    } else {
      response.status(404).json({error:`Could not find folder with id of ${request.params.id}`})
    }
  })
  .catch( error => response.status(500).json({ error }))
}

const getLinkByFolderId = (request, response) => {
  database('links').where('folders_id', request.params.folders_id).select()
  .then((link) => {
    if(link.length) {
      response.status(200).json(link);
    } else {
      response.status(200).json({note: 'No links exist'})
    }
  })
  .catch( error => response.status(500).json({ error }))
}

const getShortUrl = (request, response) => {
  let clicks
  database('links').where('short_url', request.params.short_url).select()
  .then((data) => {
    const link = data[0]
    clicks = link.clicks + 1
    response.redirect(301, link.long_url)
  })
  .then(() =>  {
    database('links').where('short_url', request.params.short_url).update('clicks', clicks)
    .then((number)=> {
      response.status(204)
    })
    .catch(error => response.status(500).json({error}))
  })
  .catch((error) => response.status(404).json({error: `Nothing at ${request.params.short_url}`}))
}

const createFolder = (request, response) => {
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
}

const createLink = (request, response) => {
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
}

module.exports = {
  getAllFolders: getAllFolders,
  getAllLinks: getAllLinks,
  getFolderById: getFolderById,
  getLinkByFolderId: getLinkByFolderId,
  getShortUrl: getShortUrl,
  createFolder: createFolder,
  createLink: createLink
}
