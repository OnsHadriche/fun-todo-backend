const multer = require("multer")
const path = require("path")
const {fileFilter} = require("../../utilities/multer")
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: `${__dirname}/../../public/uploads`,
    filename: (req, file, cb) => {
      // cb() can be named done()
      cb(null, uuidv4() + path.extname(file.originalname))
    }
  });

  const fileUpload = multer({
    storage: storage,
    fileFilter: fileFilter
  });
  
  const upload = fileUpload.single('image'); // because in form data we named the file field 'image' 
  
  module.exports = (req, res, next) => {
      upload(req, res, (err) => {
          if (err instanceof multer.MulterError || err) {
              // A Multer error occurred when uploading || An unknown error occurred when uploading
              return res.status(400).json({
                  type: 'error',
                  message: err.message,
                  details: err
              })
          }
          // Everything went fine
          next();
      })
  }