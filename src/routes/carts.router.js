import express from "express";
import CartManager from "../managers/cart-manager.js";

const router = express.Router();
const manager = new CartManager("./src/data/carritos.json");

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await manager.crearCarrito();
        res.status(201).send(nuevoCarrito);
    } catch (error) {
        res.status(500).send("Error al crear el carrito");
    }
});

router.get("/:cid", async (req, res) => {
    const carritoId = parseInt(req.params.cid);
    try {
        const carrito = await manager.getCarritoById(carritoId);
        res.send(carrito);
    } catch (error) {
        res.status(404).send("Carrito no encontrado");
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const carritoId = parseInt(req.params.cid);
    const productoId = parseInt(req.params.pid);
    const { quantity } = req.body;

    try {
        const carritoActualizado = await manager.agregarProductoAlCarrito(carritoId, productoId, quantity || 1);
        res.send(carritoActualizado);
    } catch (error) {
        res.status(500).send("Error al agregar producto al carrito");
    }
});

export default router;