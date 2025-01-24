import express from "express";
import productRouter from "./routes/products.router.js"; 
import cartRouter from "./routes/carts.router.js"; 

const app = express()

app.use(express.json())

app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)

app.get("/", (req, res) => {
    res.send("¡Bienvenido a la API!");
});

app.listen(8080, () => {
    console.log("Servidor corriendo en http://localhost:8080");
});