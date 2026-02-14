import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  updateProfile, 
  getFavorites, 
  addFavorite, 
  removeFavorite,
  syncFavorites 
} from '../controllers/userController.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);

// Rotas de favoritos
router.get('/favorites', protect, getFavorites);
router.post('/favorites', protect, addFavorite);
router.delete('/favorites/:productId', protect, removeFavorite);
router.post('/favorites/sync', protect, syncFavorites);

export default router;
