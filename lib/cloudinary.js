// lib/cloudinary.js
import { v2 as cloudinaryV2 } from 'cloudinary';

cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const cloudinary = cloudinaryV2;