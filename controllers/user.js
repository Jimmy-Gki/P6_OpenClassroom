//IMPORTS
const bcrypt = require('bcrypt'); //Import du package bcrypt
const jwt = require('jsonwebtoken'); //Import du package json web token

const userModel = require('../models/user'); //Import du modèle de données "utilisateur"

//Middleware pour l'enregistrement des nouveaux utilisateurs
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        //Création d'un nouvel utilisateur
        const user = new userModel({
          email: req.body.email,
          //Hachage du mot de passe avant de l'envoyer dans la base de données
          password: hash,
        });
        //Enregistrement de l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(200).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ message: error.message }));
      })
      .catch(error => res.status(500).json({ error }));
};

//Middleware pour la connexion des utilisateurs existants
exports.login = (req, res, next) => {
    //Chercher les utilisateurs dans la base de données
    userModel.findOne({ email: req.body.email })
        .then(user => {
            //Si l'utilisateur est introuvable
            if (!user) {
                //Afficher un message d'erreur
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            //On compare le mdp envoyé par l'utilisateur qui essaye de se connecter avec le hash qui est dans la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //Si le mdp est incorrect
                    if (!valid) {
                        //Renvoyer un message d'erreur
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    //Le mdp correspond
                    res.status(200).json({
                        userId: user._id, //Identifiant de l'utilisateur dans la base de données
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.RANDOM_TOKEN_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
