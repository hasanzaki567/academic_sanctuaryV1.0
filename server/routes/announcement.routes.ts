import { Router } from 'express';
import {
  getAnnouncements,
  createAnnouncement,
} from '../controllers/announcement.controller.js';

const router = Router();

router.get('/', getAnnouncements);
router.post('/', createAnnouncement);

export default router;
