import express from 'express';
import * as tagController from './tag.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', tagController.createTag);
router.get('/', tagController.getTags);
router.get('/:id', tagController.getTagById);
router.patch('/:id', tagController.updateTag);
router.delete('/:id', tagController.deleteTag);

export default router;
