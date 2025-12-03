// ===== CONFIGURAÇÃO S3 (AWS SDK v3) =====
// Compatível com: AWS S3, Backblaze B2, Cloudflare R2, DigitalOcean Spaces

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Configurar cliente S3
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true, // Necessário para alguns provedores (Backblaze, R2)
});

/**
 * Upload de arquivo para S3
 * @param {Buffer} fileBuffer - Buffer do arquivo
 * @param {string} fileName - Nome do arquivo no S3
 * @param {string} contentType - Tipo MIME do arquivo
 * @returns {Promise<string>} URL pública do arquivo
 */
async function uploadToS3(fileBuffer, fileName, contentType) {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read', // Tornar arquivo público
    });

    await s3Client.send(command);

    // Construir URL pública
    const publicUrl = `${process.env.S3_PUBLIC_URL}/${fileName}`;
    
    console.log(`✅ Upload realizado: ${fileName}`);
    return publicUrl;

  } catch (error) {
    console.error('❌ Erro no upload S3:', error);
    throw new Error('Falha no upload para S3');
  }
}

/**
 * Gerar nome único para arquivo
 * @param {string} originalName - Nome original do arquivo
 * @param {string} albumId - ID do álbum
 * @returns {string} Nome único do arquivo
 */
function generateFileName(originalName, albumId) {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  const sanitizedName = originalName
    .replace(/[^a-zA-Z0-9.]/g, '_')
    .substring(0, 50);
  
  return `albums/${albumId}/${timestamp}_${sanitizedName}`;
}

module.exports = {
  uploadToS3,
  generateFileName,
  s3Client,
};
