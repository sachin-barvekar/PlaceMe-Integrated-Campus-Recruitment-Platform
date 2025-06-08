const cloudinary = require('cloudinary').v2

exports.uploadImageToCloudinary = async (filePath, folder, fileName) => {
  const options = {
    folder,
    resource_type: 'auto',
    public_id: fileName,
  }
  return cloudinary.uploader.upload(filePath, options)
}
