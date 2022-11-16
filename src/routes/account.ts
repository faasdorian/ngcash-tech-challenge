import { Router } from 'express';
import { getBalance, transfer, getTransactions } from '../controllers/accountController';
import { authJwt } from '../middlewares/authJwt';

const router = Router();

router.get('/:accountId/balance', authJwt, getBalance);
router.post('/:accountId/transfer', authJwt, transfer);
router.get('/:accountId/transactions', authJwt, getTransactions);

export default router;