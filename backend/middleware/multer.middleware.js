import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public") // cb is callback
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
        // original name can be replaced by unique name, though it remains on local storage for very short time, then its transfered to cloudinary
    }
})

export const upload = multer({ 
    storage,
})