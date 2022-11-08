//IMPORTS
const dotenv = require('dotenv').config()
console.log(dotenv);
const express = require('express'); //Import du package "express"
const mongoose = require('mongoose'); //Import du package "mongoose"
const bodyParser = require('body-parser'); //Import du package "body-parser"
const path = require('path'); //Import du package "path"
const helmet = require('helmet'); //Import du package helmet

//IMPORTS DES ROUTES
const saucesRoad = require('../road/sauce'); //Import de la route Sauce
const userRoad = require('../road/user'); //Import de la route Utilisateur

//Création de l'app "express"
const app = express();

app.use(helmet({
  crossOriginResourcePolicy: false,
}))

//Connexion à la base de données
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_NAME}.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`,
 
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));  

//Intercepte toutes les requêtes qui ont un content-type json
app.use(bodyParser.json());

//Définition des CORS
app.use((req, res, next) => {
      //Acceder à l'API deuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
      //Possibilité d'ajouter les headers mentionnés aux requètes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      //Possibilité d'envoyer des requètes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Gestions des routes principales
app.use('/images', express.static(path.join(__dirname, '../images'))); //Les images
app.use('/api/auth', userRoad); //Les authorisations
app.use('/api/sauces', saucesRoad); //Les sauces

//Export de l'app "express"
module.exports = app;