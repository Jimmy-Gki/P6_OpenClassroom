//IMPORTS
const multer = require('multer'); //Import du package multer

//Création d'un dictionnaire MIME_TYPES
const MIME_TYPES = {
  //Types de fichiers acceptés
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//Configuration
//Indiquer à "multer" dans quel dossier il doit enregistrer les fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    //"null" = il n'y a pas d'erreur, "images" = le dossier de destination
    callback(null, 'images');
  },

  //Indiquer à "multer" quel nom de fichier à utiliser
  filename: (req, file, callback) => {
    //Génération du nom du fichier
    const name = file.originalname.split(' ').join('_');
    //Application de l'extension du fichier en utilisant des MIME_TYPES
    const extension = MIME_TYPES[file.mimetype];
    //"null" pour indiquer qu'il n'y a pas d'erreur + le nom du fichier entier
    callback(null, name + Date.now() + '.' + extension);
  }
});

//Exportation du middleware multer
module.exports = multer({storage: storage}).single('image');