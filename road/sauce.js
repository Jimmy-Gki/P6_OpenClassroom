//IMPORTS
const express = require('express'); //Import du package "express"

//IMPORTS ROUTES
const auth = require('../middleware/auth'); //Import du middleware d'authentification
const multer = require('../middleware/multer-config'); //Import du middleware config
const sauceCtrl = require('../controllers/sauce'); //Import du controller sauce

//Création du router
const router = express.Router();

//Creation des 3 routes (Create, Read & Delete)
//C = Create, ajouter une sauce
//R = Read, lire une sauce
//U = Update, modifier une sauce
//D = Delete, supprimer une sauce
router.post('/', auth, multer, sauceCtrl.createSauce); //Route pour l'ajout d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); //Route pour modifier une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce); //Route pour supprimer une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); //Route pour voir une sauce
router.get('/', auth, sauceCtrl.getAllSauces); //Route pour voir toutes les sauces
router.post('/:id/like', auth, sauceCtrl.likeSauce); //Route pour liker une sauce

//Exportation du router
module.exports = router;