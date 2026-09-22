import { Router } from 'express';
import { wishlistController } from '../controllers/wishlistController.js';

const router = Router();

router.get('/', wishlistController.getWishlist);
router.get('/check/:movieId', wishlistController.checkWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:movieId', wishlistController.removeFromWishlist);
router.delete('/', wishlistController.clearWishlist);

export default router;
