const multer = require('multer');
const path = require('path')
const {fileFilter} = require('../../utilities/multer');

const fileUpload = multer({
  storage: multer.diskStorage({
    
  }),
  fileFilter: fileFilter
});

const upload = fileUpload.single('image'); // because in form data we named the file field 'image'

module.exports = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError || err) {
            console.log(err)
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