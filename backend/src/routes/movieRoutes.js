import { Router } from 'express';
import { movieController } from '../controllers/movieController.js';

const router = Router();

router.get('/genres', movieController.getGenres);
router.get('/discover', movieController.discover);
router.get('/trending', movieController.getTrending);
router.get('/search', movieController.search);
router.get('/:id', movieController.getDetails);
router.get('/:id/recommendations', movieController.getRecommendations);

export default router;
