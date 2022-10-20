//IMPORTS
const express = require('express'); //Import du package express
const userCtrl = require('../controllers/user'); //Import du controlleur utilisateur

//Création du router
const router = express.Router();

router.post('/signup', userCtrl.signup); //Route pour l'inscription d'un nouvel utilisateur
router.post('/login', userCtrl.login); //Route pour la connexion d'un utilisateur

//Exportation du router
module.exports = router;