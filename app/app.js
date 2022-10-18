//Import express & mongoose & path & bodyParser
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

//Get user road
const saucesRoad = require('../road/sauce');
const userRoad = require('../road/user');

//Connect app with MongoDB
mongoose.connect('mongodb+srv://JimmyGki:Jimmy270103@p6-piquante.dqmncyu.mongodb.net/?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

//Call express for start app express
const app = express();

//Allow the application to access the API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

//And save it
app.use('/images', express.static(path.join(__dirname, '../images')));
app.use('/api/auth', userRoad);
app.use('/api/sauces', saucesRoad);

//Export app for an access in other files
module.exports = app;