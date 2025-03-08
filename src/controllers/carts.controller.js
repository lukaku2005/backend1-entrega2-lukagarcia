import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';

import mongoose from 'mongoose';


export const addProductToCart = async (req, res) => {
  try {
    const idCarrito = req.params.cid; 
    const idProducto = req.params.pid; 
    const { quantity } = req.body; 

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).send({ mensaje: 'La cantidad debe ser un número positivo' });
    }
    const cart = await Cart.findById(idCarrito);
    if (!cart) {
      return res.status(404).send({ mensaje: 'El carrito no existe' });
    }
    const product = await Product.findById(idProducto);
    if (!product) {
      return res.status(404).send({ mensaje: 'El producto no existe' });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === idProducto);

    if (productIndex !== -1) {
      await Cart.findOneAndUpdate(
        { _id: idCarrito, 'products.product': idProducto },
        { $set: { 'products.$.quantity': cart.products[productIndex].quantity + quantity } }
      );
    } else {
      await Cart.findByIdAndUpdate(
        idCarrito,
        { $push: { products: { product: idProducto, quantity } } }
      );
    }

    return res.status(200).send({ mensaje: 'Producto agregado al carrito correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ mensaje: 'Error al agregar el producto al carrito' });
  }
};


export const getCartById = async (req, res) => {
  try {
    const idCarrito = req.params.cid;

    if (!mongoose.Types.ObjectId.isValid(idCarrito)) {
      return res.status(400).send({ mensaje: 'ID de carrito inválido' });
    }

    const carrito = await Cart.findById(idCarrito).populate('products.product');
    if (!carrito) {
      return res.status(404).send({ mensaje: 'El carrito no existe' });
    }
    return res.status(200).render('templates/cartDetails', { cart: carrito });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      return res.status(500).send({ mensaje: 'Error al obtener el carrito' });
    }
  }
};

  
  

  export const createCart = async (req, res) => {
    try {
      const newCart = await Cart.create({ products: [] });
      if (!res.headersSent) {  
        return res.status(201).send({ mensaje: `Carrito creado con el id ${newCart._id}` });
      }
    } catch (error) {
      console.error(error);
      if (!res.headersSent) {  
        return res.status(500).send({ mensaje: 'Error al crear el carrito' });
      }
    }
  };
  

  export const updateProductInCart = async (req, res) => {
    try {
      const idCarrito = req.params.cid;  
      const idProducto = req.params.pid; 
      const { quantity } = req.body;    

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).send({ mensaje: 'La cantidad debe ser un número positivo' });
      }
      const cart = await Cart.findById(idCarrito);
      if (!cart) {
        return res.status(404).send({ mensaje: 'El carrito no existe' });
      }
      const product = await Product.findById(idProducto);
      if (!product) {
        return res.status(404).send({ mensaje: 'El producto no existe' });
      }
      const productIndex = cart.products.findIndex(
        p => p.product.toString() === idProducto
      );
      if (productIndex !== -1) {
        await Cart.findOneAndUpdate(
          { _id: idCarrito, 'products.product': idProducto },
          { $set: { 'products.$.quantity': quantity } }
        );
      } else {
        await Cart.findByIdAndUpdate(
          idCarrito,
          { $push: { products: { product: idProducto, quantity } } }
        );
      }

      return res.status(200).send({ mensaje: 'Carrito actualizado correctamente' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ mensaje: 'Error al actualizar el carrito' });
    }
};

  


export const updateCart = async (req, res) => {
  try {
    const idCarrito = req.params.cid;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).send({ mensaje: 'Los productos deben ser un array' });
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      idCarrito,
      { products },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).send({ mensaje: 'El carrito no existe' });
    }

    return res.status(200).send({ mensaje: `Carrito con id ${idCarrito} fue modificado` });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ mensaje: 'Error al actualizar el carrito' });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const idCarrito = req.params.cid;
    const idProducto = req.params.pid;

    const updatedCart = await Cart.findOneAndUpdate(
      { _id: idCarrito },
      { $pull: { products: { product: idProducto } } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).send({ mensaje: 'El carrito no existe' });
    }

    return res.status(200).send({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ mensaje: 'Error al eliminar el producto del carrito' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const idCarrito = req.params.cid;

    const updatedCart = await Cart.findByIdAndUpdate(
      idCarrito,
      { $set: { products: [] } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).send({ mensaje: 'El carrito no existe' });
    }

    return res.status(200).send({ mensaje: 'Carrito vaciado completamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ mensaje: 'Error al vaciar el carrito' });
  }
};
