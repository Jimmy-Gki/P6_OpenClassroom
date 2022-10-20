//IMPORTS
const jwt = require('jsonwebtoken'); //Import du package "json web token" pour encoder des "tokens"

//Création d'un middleware d'authentification de requête
module.exports = (req, res, next) => {
   try {
       //Récupération du token dans le header authorization de 'En-tête de requête'
       const token = req.headers.authorization.split(' ')[1];
       //Décodage du token
       //Token à vérifier + clé d'encodage
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       //Extraire le "userId" qui est à l'intérieur
       const userId = decodedToken.userId;
       //Ajout de "userId" à l'objet requête pour le rendre accessible à tous les middleware
       req.auth = { userId: userId };
       //Vérifier si "userId" de la requête correspond à celui du token
       if (req.body.userId && req.body.userId !== userId) {
        throw "User ID non valable";
      } else {
        next();
      }
   } catch(error) {
       res.status(401).json({ error });
   }
};