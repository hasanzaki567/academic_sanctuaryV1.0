import { Router } from 'express';
import {
  getSubjects,
  getSubjectById,
  createSubject,
} from '../controllers/subject.controller.js';

const router = Router();

router.get('/', getSubjects);
router.get('/:id', getSubjectById);
router.post('/', createSubject);

export default router;
