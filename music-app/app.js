// const express = require('express');
// const path = require('path');

// const app = express();

// // Set view engine to EJS
// app.set('view engine', 'ejs');

// // Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

// // Routes
// app.get('/', (req, res) => {
//     res.render('pages/home');
// });

// app.get('/explore', (req, res) => {
//     res.render('pages/explore');
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });




const express = require('express');
const path = require('path');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const qs = require('qs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Set view engine to EJS
app.set('view engine', 'ejs');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse cookies
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
    res.render('pages/home');
});

app.get('/explore', (req, res) => {
    res.render('pages/explore');
});

app.get('/login', (req, res) => {
    const scope = 'user-read-private user-read-email user-read-playback-state streaming';
    const params = qs.stringify({
        client_id: CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: scope
    });

    res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const data = {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
    };

    const headers = {
        headers: {
            'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify(data), headers);
        const accessToken = response.data.access_token;
        res.cookie('access_token', accessToken);
        res.redirect('/explore');
    } catch (error) {
        res.send(error);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




// const client_id = '1825746372a54d109f5b454536f999ab'; 
// const client_secret = '214b213916b04801809c7e7c824bd898';

// async function getToken() {
//   const response = await fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     body: new URLSearchParams({
//       'grant_type': 'client_credentials',
//     }),
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
//     },
//   });

//   return await response.json();
// }

// async function getTrackInfo(access_token) {
//   const response = await fetch("https://api.spotify.com/v1/tracks/4cOdK2wGLETKBW3PvgPWqT", {
//     method: 'GET',
//     headers: { 'Authorization': 'Bearer ' + access_token },
//   });

//   return await response.json();
// }

// getToken().then(response => {
//   getTrackInfo(response.access_token).then(profile => {
//     console.log(profile)
//   })
// });


