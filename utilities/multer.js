const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/gif': 'gif'
};

const fileFilter = (req, file, cb) => {
    // The function should call `cb` with a boolean as a second parameter:
    // To reject this file pass `false`
    // To accept the file pass `true`
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    // You can always pass an error as a first parameter to `cb` if something goes wrong
    // Otherwise, pass `null`
    const error = isValid ? null : new Error('Invalid file type!');
    cb(error, isValid);
}

module.exports = {
    fileFilter
}