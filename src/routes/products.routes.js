import { Router } from 'express';

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products.controllers.js';

const productRouter = Router();

productRouter.get('/', getAllProducts);    
productRouter.get('/:pid', getProductById);
productRouter.post('/', createProduct);
productRouter.put('/:pid', updateProduct);
productRouter.delete('/:pid', deleteProduct);

export default productRouter;