const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Playlist = sequelize.define('Playlist', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'Playlists',
    timestamps: false
});

module.exports = Playlist;