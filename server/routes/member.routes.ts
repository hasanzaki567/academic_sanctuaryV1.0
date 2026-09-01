import { Router } from 'express';
import { getMembers } from '../controllers/member.controller.js';

const router = Router();

router.get('/', getMembers);

export default router;
