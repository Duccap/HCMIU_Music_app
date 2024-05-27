const Sequelize = require('sequelize');

const sequelize = new Sequelize('music_app', 'root', 'secret', {
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectOptions: {
        ssl: false
    },
    logging: false
});

module.exports = sequelize;