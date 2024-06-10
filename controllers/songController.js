const Song = require('../models/song');

exports.getSongsPage = async (req, res) => {
    try {
        // Fetch songs from the database
        const songs = await Song.findAll();
        res.render('songs', { user: req.session.user, songs });
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).send('Internal Server Error');
    }
};
