const Playlist = require('../models/playlist');
const Song = require('../models/song');
const PlaylistSong = require('../models/playlist_song');

exports.getPlaylists = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const playlists = await Playlist.findAll({ where: { user_id: req.session.user.id } });
        res.render('playlists', { user: req.session.user, playlists });
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createPlaylist = async (req, res) => {
    const { name } = req.body;
    try {
        await Playlist.create({ name, user_id: req.session.user.id });
        res.redirect('/playlists');
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deletePlaylist = async (req, res) => {
    const { playlistId } = req.params;
    try {
        // Delete all PlaylistSong entries for this playlist
        await PlaylistSong.destroy({ where: { playlist_id: playlistId } });
        
        // Delete the playlist
        await Playlist.destroy({ where: { id: playlistId, user_id: req.session.user.id } });
        
        res.redirect('/playlists');
    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.getPlaylistSongs = async (req, res) => {
    const { playlistId } = req.params;
    try {
        const playlist = await Playlist.findByPk(playlistId);
        if (!playlist || playlist.user_id !== req.session.user.id) {
            return res.status(404).send('Playlist not found');
        }

        // Fetch all songs
        const songs = await Song.findAll();

        // Fetch playlist songs and include the associated Song data
        const playlistSongs = await PlaylistSong.findAll({
            where: { playlist_id: playlistId },
            include: [Song]
        });

        res.render('playlist_songs', { user: req.session.user, playlist, songs, playlistSongs });
    } catch (error) {
        console.error('Error fetching playlist songs:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.addSongToPlaylist = async (req, res) => {
    const playlistId = req.params.playlistId;
    const songId = req.body.songId;
    console.log('playlistId:', playlistId);
    try {
        await PlaylistSong.create({ playlist_id: playlistId, song_id: songId });
        res.redirect(`/playlists/${playlistId}`);
    } catch (error) {
        console.error('Error adding song to playlist:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.removeSongFromPlaylist = async (req, res) => {
    const { playlistId, songId } = req.params;
    try {
        await PlaylistSong.destroy({ where: { playlist_id: playlistId, song_id: songId } });
        res.redirect(`/playlists/${playlistId}`);
    } catch (error) {
        console.error('Error removing song from playlist:', error);
        res.status(500).send('Internal Server Error');
    }
};
