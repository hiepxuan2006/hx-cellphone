const multer = require("multer")
const { body, validationResult } = require("express-validator")

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const { folder } = req.params
      cb(null, `public/upload/product`)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname)
    },
  }),
})
module.exports.handleImageUpload = (req, res, next) => {
  upload.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }

    // Validate the uploaded file

    next()
  })
}

module.exports.handleImageUploadMulti = (req, res, next) => {
  upload.array("image", 10)(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }

    // Validate the uploaded files
    const allowedExtensions = [".jpg", ".jpeg", ".png"]

    next()
  })
}
