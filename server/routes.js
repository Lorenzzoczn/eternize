// ===== ROTAS DA API =====

const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { uploadToS3, generateFileName } = require('./s3');

const router = express.Router();

// Configurar multer para upload em memória
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Aceitar apenas imagens
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'), false);
    }
  },
});

// Banco de dados em memória (para produção, use MongoDB/PostgreSQL)
const albums = new Map();

// ===== ROTA 1: Criar Álbum =====
router.post('/album', (req, res) => {
  try {
    const albumId = uuidv4();
    
    albums.set(albumId, {
      id: albumId,
      photos: [],
      createdAt: new Date().toISOString(),
    });

    console.log(`✅ Álbum criado: ${albumId}`);

    res.json({
      success: true,
      albumId: albumId,
    });

  } catch (error) {
    console.error('❌ Erro ao criar álbum:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar álbum',
    });
  }
});

// ===== ROTA 2: Upload de Foto =====
router.post('/upload/:albumId', upload.single('file'), async (req, res) => {
  try {
    const { albumId } = req.params;
    const file = req.file;

    // Validar álbum
    if (!albums.has(albumId)) {
      return res.status(404).json({
        success: false,
        error: 'Álbum não encontrado',
      });
    }

    // Validar arquivo
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo enviado',
      });
    }

    // Gerar nome único
    const fileName = generateFileName(file.originalname, albumId);

    // Upload para S3
    const photoUrl = await uploadToS3(
      file.buffer,
      fileName,
      file.mimetype
    );

    // Salvar URL no álbum
    const album = albums.get(albumId);
    album.photos.push({
      url: photoUrl,
      uploadedAt: new Date().toISOString(),
      filename: file.originalname,
    });

    console.log(`✅ Foto adicionada ao álbum ${albumId}`);

    res.json({
      success: true,
      url: photoUrl,
      albumId: albumId,
    });

  } catch (error) {
    console.error('❌ Erro no upload:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro ao fazer upload',
    });
  }
});

// ===== ROTA 3: Buscar Fotos do Álbum =====
router.get('/album/:albumId', (req, res) => {
  try {
    const { albumId } = req.params;

    // Validar álbum
    if (!albums.has(albumId)) {
      return res.status(404).json({
        success: false,
        error: 'Álbum não encontrado',
      });
    }

    const album = albums.get(albumId);

    res.json({
      success: true,
      albumId: albumId,
      photos: album.photos.map(p => p.url),
      photoDetails: album.photos,
      createdAt: album.createdAt,
      totalPhotos: album.photos.length,
    });

  } catch (error) {
    console.error('❌ Erro ao buscar álbum:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar álbum',
    });
  }
});

// ===== ROTA 4: Listar Todos os Álbuns (Admin) =====
router.get('/albums', (req, res) => {
  try {
    const allAlbums = Array.from(albums.values()).map(album => ({
      id: album.id,
      photoCount: album.photos.length,
      createdAt: album.createdAt,
    }));

    res.json({
      success: true,
      albums: allAlbums,
      total: allAlbums.length,
    });

  } catch (error) {
    console.error('❌ Erro ao listar álbuns:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar álbuns',
    });
  }
});

// ===== ROTA 5: Health Check =====
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    albums: albums.size,
  });
});

module.exports = router;
