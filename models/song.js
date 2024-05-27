const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Song = sequelize.define('Song', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    artist: {
        type: Sequelize.STRING,
        allowNull: false
    },
    album: {
        type: Sequelize.STRING,
        allowNull: false
    },
    duration: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    file_location: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    tableName: 'Songs', 
    timestamps: false
});

module.exports = Song;