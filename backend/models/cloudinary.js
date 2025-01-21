const {v2: cloudinary} = require("cloudinary")
const fs = require("fs")

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
   try {
     const response = await cloudinary.uploader.upload(localFilePath, {
       resource_type: "auto",
     });
     console.log("File uploaded to Cloudinary:", response.url);
     return response;
   } catch (error) {
     console.error("Cloudinary upload error:", error);
     return null;
   } finally{
    if(fs.existsSync(localFilePath)){
      fs.unlinkSync(localFilePath);
    }
   }
 };

module.exports = {uploadOnCloudinary}