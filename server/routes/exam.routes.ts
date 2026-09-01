import { Router } from 'express';
import { getExams, createExam } from '../controllers/exam.controller.js';

const router = Router();

router.get('/', getExams);
router.post('/', createExam);

export default router;
