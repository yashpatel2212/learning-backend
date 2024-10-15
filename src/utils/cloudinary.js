import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.ENV.CLOUDINARY_CLOUD_NAME,
    api_key: process.ENV.CLOUDINARY_API_KEY,
    api_secret: process.ENV.CLOUDINARY_API_SECRET_KEY
});

const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        console.log("File has been uploaded on cloudinary", response.url);
        return response;
} catch (error) {
    fs.unlinkSync(localFilePath)// remove the locally saved file temporary file as the upload operation got failed
    return null
    }
}


export {uploadOnCloudinary};