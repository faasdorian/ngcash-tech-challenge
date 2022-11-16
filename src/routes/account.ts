import { Router } from 'express';
import { getBalance } from '../controllers/accountController';
import { authJwt } from '../middlewares/authJwt';

const router = Router();

router.get('/:accountId/balance', authJwt, getBalance);

export default router;