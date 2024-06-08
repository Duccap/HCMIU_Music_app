const path = require('path');
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// define models here
const sequelize = require('./util/database');
const user = require('./models/user');
const song = require('./models/song');
const playlist = require('./models/playlist');
const playlist_song = require('./models/playlist_song');

// add routes here (add the correct path)
const homeRoutes = require('./routes/homeRoutes');
const userRoutes = require('./routes/userRoutes');
const songRoutes = require('./routes/songRoutes');
const playlistRoutes = require('./routes/playlistRoutes');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'duccap', // Replace with your own secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
    store: new SequelizeStore({
        db: sequelize
    })
}));


app.use(homeRoutes);
app.use(userRoutes);
app.use(songRoutes);
app.use(playlistRoutes);


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
