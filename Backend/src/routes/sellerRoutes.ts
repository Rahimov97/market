import express from 'express';
import {
  getSellers,
  getSellerById,
  createSeller,
  updateSeller,
  deleteSeller,
} from '../controllers/sellerController';

const router = express.Router();

router.get('/', getSellers);
router.get('/:id', getSellerById);
router.post('/', createSeller);
router.put('/:id', updateSeller);
router.delete('/:id', deleteSeller);

export default router;
