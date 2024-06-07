const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const PlaylistSong = sequelize.define('PlaylistSong', {
    playlist_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Playlists',
            key: 'id'
        }
    },
    song_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Songs',
            key: 'id'
        }
    }
}, {
    tableName: 'Playlist_Songs',
    timestamps: false
});

module.exports = PlaylistSong;