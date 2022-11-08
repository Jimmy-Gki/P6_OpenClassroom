//IMPORTS
const mongoose = require('mongoose'); //Import du package mongoose

//Creation du schéma de données
const saucesSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: String, required: true },
  likes: { type:Number, required: false },
  dislikes: { type:Number, required: false },
  usersLiked: { type: Array, required: false },
  usersDisliked: { type: Array, required: false }
});

//Exportation du modèle de données
module.exports = mongoose.model('Sauces', saucesSchema);