//IMPORTS
const Sauce = require('../models/sauce'); //Import du model sauce
const fs = require('fs'); //Import du package "file system"


//Middleware pour voir toute les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) =>  res.status(200).json(sauces))
    .catch((error) =>  res.status(400).json({ error }));
};

//Middleware pour voir une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

//Middleware pour créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
  //Transforme la chaîne de caractère en objet
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  //Création d'une nouvelle sauce
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    //On recréer l'url complète de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //On met à jour la création de la sauce dans la base de données
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

//Middleware pour modifier une sauce
exports.modifySauce =  (req, res, next) => {
    //On vérifie si le fichier request.file existe
  const sauceObject = req.file ?
  { 
    ...JSON.parse(req.body.sauce),
    //On reconstruit l'url complète du fichier enregistré
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
   //On met à jour les modifications
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

//Middleware pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
  .then(sauce => {
    //On récupère le nom du fichier à supprimer
    const filename = sauce.imageUrl.split('/images/')[1];
    //On utilise unlink du package "fs" pour supprimer un fichier du système
    fs.unlink(`images/${filename}`, () => {
      //On met à jour la suppression dans la base de données
      Sauce.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};

//Middleware qui permet d'ajouter ou de modifier les likes et dislikes
exports.likeSauce = (req, res, next) =>{
 const sauceId = req.params.id;
 const userId = req.body.userId;
 const like = req.body.like;

    //Like = 1 => L'utilisateur aime la sauce (like = +1)
    if (like === 1) {
      Sauce.updateOne({ _id: sauceId }, {
          // On push l'utilisateur et on incrémente le compteur de 1
          $push: { usersLiked: userId },
          $inc: { likes: +1 },
        })
        .then(() => res.status(200).json({ message: 'like ajouté !' }))
        .catch((error) => res.status(400).json({ error }))
    }

    //Like = -1 => L'utilisateur n'aime pas la sauce (dislike = +1)
    if (like === -1) {
      Sauce.updateOne(
          { _id: sauceId }, {
            $push: { usersDisliked: userId },
            $inc: { dislikes: +1 },
          })
        .then(() => { res.status(200).json({message: 'Dislike ajouté !'})
        })
        .catch((error) => res.status(400).json({ error }))
    }

    // Like = 0  => L'utilisateur annule son like (like = 0)
    if (like === 0) {
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) { // Si il s'agit d'annuler un like
            Sauce.updateOne({ _id: sauceId }, {
                //Utilisation de l'opérateur '$pull' de mongoDB pour supprimer le 'userId' dans le champ 'usersLiked' dans la base de données
                //Utilisation de l'opérateur '$inc' de mongoDB pour soustraire la valeur fixée du champ 'dislike' à '-1' dans la base de données
                $pull: { usersLiked: userId },
                $inc: { likes: -1},
              })
              .then(() => res.status(200).json({ message: 'Like retiré !' }))
              .catch((error) => res.status(400).json({ error }))
          }
          if (sauce.usersDisliked.includes(userId)) { // Si il s'agit d'annuler un dislike
            //Mise à jour des modifications dans la base de données
            Sauce.updateOne({
                _id: sauceId}, 
                {
                $pull: {
                  usersDisliked: userId },
                $inc: {
                  dislikes: -1 },
              })
              .then(() => res.status(200).json({ message: 'Dislike retiré !' }))
              .catch((error) => res.status(400).json({ error }))
          }
        })
        .catch((error) => res.status(404).json({ error }))
    }
 }
