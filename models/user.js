const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  avatar_location: {
    type: Sequelize.STRING,
    defaultValue: 'default.jpg'
  }
}, {
  timestamps: false 
});

module.exports = User;