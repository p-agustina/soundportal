const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
 
const storage = new CloudinaryStorage({
  // cloudinary: cloudinary,
  cloudinary,
  params: {
    allowed_formats: ['jpg', 'png'],
    folder: 'userimages', // The name of the folder in cloudinary 
  }
});

const musicstorage = new CloudinaryStorage({
  // cloudinary: cloudinary,
  cloudinary,
  params: {
    allowed_formats: ['mp3', 'mpeg'],
    folder: 'songs', // The name of the folder in cloudinary
    resource_type: 'raw' 
  }
});


const uploader = multer({ storage })
const musicuploader = multer({musicstorage})

module.exports = {
	uploader,
  musicuploader,
	cloudinary
}