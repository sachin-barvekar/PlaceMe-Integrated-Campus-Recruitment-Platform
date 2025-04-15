const cloudinary = require('cloudinary').v2
exports.uploadImageToCloudinary = async (file, folder) => {
  const fileName = file.name.replace(/\.[^/.]+$/, '')
  const options = {
    folder,
    resource_type: 'auto',
    public_id: `${fileName}`,
  }

  return cloudinary.uploader.upload(file.tempFilePath, options)
}
