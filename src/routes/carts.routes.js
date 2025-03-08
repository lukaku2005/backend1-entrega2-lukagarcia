import { Router } from 'express';
import { createCart } from '../controllers/carts.controller.js';
import {
  getCartById,
  updateProductInCart,
  updateCart,
  removeProductFromCart,
  clearCart
} from "../controllers/carts.controller.js";

const cartsRouter = Router();


cartsRouter.get('/:cid', getCartById) 
cartsRouter.post('/', createCart)
cartsRouter.put('/:cid/products/:pid', updateProductInCart)
cartsRouter.put('/:cid', updateCart)
cartsRouter.delete('/:cid/products/:pid', removeProductFromCart)
cartsRouter.delete('/:cid', clearCart)
cartsRouter.post('/:cid/products', updateProductInCart)

export default cartsRouter;
