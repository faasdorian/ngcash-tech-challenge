import { Router } from 'express';
import { getBalance, transfer } from '../controllers/accountController';
import { authJwt } from '../middlewares/authJwt';

const router = Router();

router.get('/:accountId/balance', authJwt, getBalance);
router.post('/:accountId/transfer', authJwt, transfer);

export default router;