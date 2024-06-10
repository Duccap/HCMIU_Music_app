const Song = require('../models/song');
const Playlist = require('../models/playlist');

exports.getSongsPage = async (req, res) => {
    try {
        // Fetch songs from the database
        const songs = await Song.findAll();
        
        // Fetch playlists for the user if logged in
        let playlists = [];
        if (req.session.user) {
            playlists = await Playlist.findAll({ where: { user_id: req.session.user.id } });
        }

        res.render('songs', { user: req.session.user, songs, playlists });
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).send('Internal Server Error');
    }
};
