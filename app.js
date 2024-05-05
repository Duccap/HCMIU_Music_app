const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');
const user = require('./models/user');
// add routes here (add the correct path)
const userRoutes = require('./routes/user');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes);


sequelize.sync().then(result => {
    console.log(result);
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
