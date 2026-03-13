const multer = require('multer')
const storage = multer.memoryStorage();


//File Filter 
const filterFile = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Image upload allowed'), false);
    }
}


const upload = multer({
    storage,
    limits: { fileSize: 5 *  1000 * 1024 },
    filterFile
});
module.exports = upload;