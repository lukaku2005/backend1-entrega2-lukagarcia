import express from "express";
import productRouter from "./routes/products.router.js"; 
import cartRouter from "./routes/carts.router.js"; 
import homeRouter from "./routes/home.router.js";
import realTimeProducts from "./routes/realTimeProducts.router.js";
import { __dirname } from './utils.js'
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import http from "http";
import ProductManager from "./managers/product-manager.js";


const productManager = new ProductManager(path.join(process.cwd(), "src", "data", "products.json"));
const app = express()
const serverHttp = http.createServer(app)
const socketServer = new Server(serverHttp)

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set('views', __dirname + '/views')

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/realtimeproducts', realTimeProducts)
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/", homeRouter)


socketServer.on("connection", async (socket) => {
    console.log(`✅ Nuevo Dispositivo Conectado ID: ${socket.id}`)

    try {
        const productsList = await productManager.getProducts()
        console.log("📦 Productos obtenidos de productManager:", productsList)

        if (productsList.length === 0) {
            console.warn("⚠️ La lista de productos está vacía.")
        }

        socket.emit("home", productsList)
        socket.emit("realtime", productsList)
    } catch (error) {
        console.error("❌ Error al obtener productos:", error);
    }

    socket.on("nuevo-producto", async (producto) => {
        await productManager.addProduct(producto);
        socketServer.emit("realtime", await productManager.getProducts());
    });

    socket.on("update-producto", async (producto) => {
        await productManager.updateProduct(producto, producto.id);
        socketServer.emit("realtime", await productManager.getProducts());
    });

    socket.on("delete-product", async (id) => {
        await productManager.deleteProduct(id);
        socketServer.emit("realtime", await productManager.getProducts());
    });
});
serverHttp.listen(8080, () => {
    console.log("Servidor corriendo en http://localhost:8080");
})