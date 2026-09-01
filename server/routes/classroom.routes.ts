import { Router } from 'express';
import {
  getClassrooms,
  getClassroomById,
  createClassroom,
  joinClassroom,
} from '../controllers/classroom.controller.js';

const router = Router();

// NOTE: /join must be registered before /:id to avoid 'join' matching as an id
router.post('/join', joinClassroom);
router.get('/', getClassrooms);
router.get('/:id', getClassroomById);
router.post('/', createClassroom);

export default router;
