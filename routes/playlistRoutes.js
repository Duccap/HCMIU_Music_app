const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

router.get('/playlists', playlistController.getPlaylists);
router.post('/playlists', playlistController.createPlaylist);
router.post('/playlists/:playlistId/delete', playlistController.deletePlaylist);
router.get('/playlists/:playlistId', playlistController.getPlaylistSongs);
router.post('/playlists/:playlistId/songs', playlistController.addSongToPlaylist);
router.post('/playlists/:playlistId/songs/:songId/delete', playlistController.removeSongFromPlaylist);

module.exports = router;
