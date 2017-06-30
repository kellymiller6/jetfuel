const express = require('express');
const router = express.Router();
const queries = require('./queries');

router.get('/api/v1/folders/', queries.getAllFolders)
router.get('/api/v1/links/', queries.getAllLinks)
router.get('/api/v1/folders/:id', queries.getFolderById)
router.get('/api/v1/folders/:folders_id/links', queries.getLinkByFolderId)
router.get('/:short_url', queries.getShortUrl)
router.post('/api/v1/folders', queries.createFolder)
router.post('/api/v1/links', queries.createLink)

module.exports = router;
