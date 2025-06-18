const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|csv)$/)) {
        req.fileValidationError = 'File format is not allowed!'
        return cb(new Error('File format is not allowed!'), false)
    }
    cb(null, true)
}

exports.imageFilter = imageFilter
