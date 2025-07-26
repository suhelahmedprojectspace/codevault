import { v2 as cloudinary } from 'cloudinary';

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error('Cloudinary environment variables not configured');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface CloudinaryUploadResult {
  secure_url: string;
  public_id?: string;
}

export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'codevault_uploads',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Final Cloudinary error:', {
            error,
            config: cloudinary.config(),
          });
          return reject(new Error(`Upload failed: ${error.message}`));
        }
        if (!result) {
          return reject(new Error('No result from Cloudinary'));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    uploadStream.on('error', (error) => {
      console.error('Upload stream error:', error);
      reject(new Error('Upload stream failed'));
    });

    uploadStream.end(buffer);
  });
}
