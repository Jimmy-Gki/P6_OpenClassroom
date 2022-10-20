//IMPORTS
const mongoose = require('mongoose'); //Import du package mongoose
const uniqueValidator = require('mongoose-unique-validator'); //Import du package unique-validator

//Création d'un schéma de données
const userSchema = mongoose.Schema({
  // email unique
  email: { type: String, required: true, unique: true },
  // mot de passe
  password: { type: String, required: true },
});

//utilisation de "unique-validator" au schéma de données
userSchema.plugin(uniqueValidator); //ce plugin s'assurera que 2 utilisateurs ne puissent pas partager la même adresse mail

//Export du modèle de données 
module.exports = mongoose.model("userModel", userSchema);