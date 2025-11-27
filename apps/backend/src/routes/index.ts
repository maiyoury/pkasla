import { Router } from 'express';
import { authRouter } from '@/modules/auth';
import { userRouter } from '@/modules/users';
import { uploadRouter } from '@/modules/upload';
import { adminRouter } from '@/modules/admin';
import { templateRouter } from '@/modules/t/template.router';
const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/upload', uploadRouter);
router.use('/admin', adminRouter);
router.use('/templates', templateRouter);

export const apiRouter: Router = router;

