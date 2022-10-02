//Import mongoose
const mongoose = require('mongoose');

//Create sauce schéma
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
  usersLiked: { type: [String], required: false },
  usersDisliked: { type: [String], required: false }
});

//Export schéma model
module.exports = mongoose.model('Sauces', saucesSchema);