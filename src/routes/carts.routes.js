import { Router } from 'express';
import { Cart } from '../models/cart.model.js';
import { createCart } from '../controllers/carts.controller.js';
import {
  getCartById,
  addProductToCart, 
  updateProductInCart,
  updateCart,
  removeProductFromCart,
  clearCart
} from "../controllers/carts.controller.js";

const cartsRouter = Router();

cartsRouter.get('/:cid', getCartById); 
cartsRouter.post('/', createCart);
cartsRouter.put('/:cid/products/:pid', updateProductInCart); 
cartsRouter.put('/:cid', updateCart); 
cartsRouter.delete('/:cid/products/:pid', removeProductFromCart); 
cartsRouter.delete('/:cid', clearCart); 
cartsRouter.post('/:cid/products/:pid', addProductToCart); 

cartsRouter.get('/', async (req, res) => {
  try {
    const carts = await Cart.find();  
    res.status(200).json(carts);  
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: 'Error al obtener los carritos' });
  }
});


export default cartsRouter;
