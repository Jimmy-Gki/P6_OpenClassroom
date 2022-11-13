//IMPORTS
const Sauce = require('../models/sauce'); //Import du model sauce
const fs = require('fs'); //Import du package "file system"


//Fonction pour voir toute les sauces
exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) =>  res.status(200).json(sauces))
    .catch((error) =>  res.status(400).json({ error }));
};

//Fonction pour voir une sauce
exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

//Fonction pour créer une nouvelle sauce
exports.createSauce = (req, res) => {
  //Transforme la chaîne de caractère en objet
  const sauceObject = JSON.parse(req.body.sauce);
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

//Fonction pour modifier une sauce
exports.modifySauce =  (req, res) => {
    //Vérifier une valeur via plusieurs conditions
  const sauceObject = req.file ? { 
    ...JSON.parse(req.body.sauce),
    //On reconstruit l'url complète du fichier enregistré
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
   if (req.auth._id == Sauce.userId) {
   //On met à jour les modifications
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }))
   } else {
    error => res.status(403).json({ message: 'Utilisateur non autorisé' })
   }
}

//Fonction pour supprimer une sauce
exports.deleteSauce = (req, res) => {
  if (req.auth._id == Sauce.userId) {
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
  .catch(error => res.status(500).json({ error }))
  } else {
    error => res.status(403).json({ message: 'Utilisateur non autorisé' })
    }
};

//Fonction qui permet d'ajouter ou de modifier les likes et dislikes
exports.likeSauce = (req, res) => {

  Sauce.findOne({
      _id: req.params.id
  }).then((sauce) => {
      //Ajouter un like à une sauce pour un utilisateur unique
      if (req.body.like === 1 && !sauce.usersLiked.includes(req.body.userId)) {
        Sauce.updateOne({ _id: req.params.id }, {
          // On push l'utilisateur et on incrémente le compteur de 1
          $push: { usersLiked: req.body.userId },
          $inc: { likes: +1 },
        })
        .then(() => res.status(200).json({ message: 'like ajouté !' }))
        .catch((error) => res.status(400).json({ error }))

          //Ajouter un dislike à une sauce pour un utilisateur unique
      } else if (req.body.like === -1 && !sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
          { _id: req.params.id }, {
            $push: { usersDisliked: req.body.userId },
            $inc: { dislikes: +1 },
          })
        .then(() => { res.status(200).json({message: 'Dislike ajouté !'})
        })
        .catch((error) => res.status(400).json({ error }))

      } else {
          //Retrait d'un like pour un utilisateur et une sauce unique
          req.body.like = 0;
          if (sauce.usersLiked.includes(req.body.userId)) {
              Sauce.updateOne({ _id: req.params.id }, {
                //Utilisation de l'opérateur '$pull' de mongoDB pour supprimer le 'userId' dans le champ 'usersLiked' dans la base de données
                //Utilisation de l'opérateur '$inc' de mongoDB pour soustraire la valeur fixée du champ 'dislike' à '-1' dans la base de données
                $pull: { usersLiked: req.body.userId },
                $inc: { likes: -1},
              })
              .then(() => res.status(200).json({ message: 'Like retiré !' }))
              .catch((error) => res.status(400).json({ error }))
          }
          //Retrait d'un dislike pour un utilisateur et une sauce unique
          if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              //Même système que pour supprimer le like
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1},
            })
            .then(() => res.status(200).json({ message: 'Dislike retiré !' }))
            .catch((error) => res.status(400).json({ error }))
          }
      }
  });
};