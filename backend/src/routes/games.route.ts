import { Router } from 'express';
import multer from 'multer';
import { GameController } from '../controllers/games.controller';

const router = Router();

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('portada'), GameController.create);
router.get('/', GameController.create);

export default router;