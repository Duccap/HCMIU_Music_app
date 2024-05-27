const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

// define models here
const sequelize = require('./util/database');
const user = require('./models/user');
const song = require('./models/song');
const playlist = require('./models/playlist');
const playlist_song = require('./models/playlist_song');

// add routes here (add the correct path)
const userRoutes = require('./routes/user');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes);

// create associations
playlist.belongsTo(user, { foreignKey: 'user_id' });
user.hasMany(playlist, { foreignKey: 'user_id' });

playlist_song.belongsTo(playlist, { foreignKey: 'playlist_id' });
playlist.hasMany(playlist_song, { foreignKey: 'playlist_id' });

playlist_song.belongsTo(song, { foreignKey: 'song_id' });
song.hasMany(playlist_song, { foreignKey: 'song_id' });


sequelize.sync().then(result => { // remove force in production
    console.log("Database synced successfully");
    // console.log(result);
    app.listen(3000);
}).catch(err => {
    console.log("Error in syncing database:")
    // console.log(err);
});
