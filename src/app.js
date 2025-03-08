import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import productRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { __dirname } from './path.js';
import { Product } from './models/product.model.js';
import { mongoConnection } from './connection/mongo.js';
import { Cart } from './models/cart.model.js';
import mongoose from 'mongoose'; 


const app = express();


const hbs = create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
});

mongoConnection().then(() => {
    const PORT = 8080;
    const server = app.listen(PORT, () => {
        console.log(`Servidor arriba, en el puerto ${PORT}`);
    });
  });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, 'views'));



app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        const cart = await Cart.findOne(); 
        res.render('index', { layout: 'main', products, cart });
    } catch (error) {
        console.error(error);
        if (!res.headersSent) { 
            res.status(500).json({ message: 'Error al obtener productos o carrito' });
        }
    }
});





app.post("/api/products", async (req, res) => {
    try {
        const result = await Product.insertMany([
            {
                code: "11111",
                stock: 6,
                price: 1000,
                category: "ropa",
                description: "remera",
                title: "alta remera"
            },
            {
                code: "11112",
                stock: 10,
                price: 1200,
                category: "ropa",
                description: "jeans",
                title: "jeans azul claro"
            },
            {
                code: "11113",
                stock: 15,
                price: 1500,
                category: "ropa",
                description: "camisa",
                title: "camisa blanca de manga larga"
            },
            {
                code: "11114",
                stock: 8,
                price: 500,
                category: "ropa",
                description: "bufanda",
                title: "bufanda de lana"
            },
            {
                code: "11115",
                stock: 25,
                price: 300,
                category: "ropa",
                description: "guantes",
                title: "guantes de algodón"
            },
            {
                code: "11116",
                stock: 18,
                price: 2500,
                category: "calzado",
                description: "zapatillas",
                title: "zapatillas deportivas"
            },
            {
                code: "11117",
                stock: 7,
                price: 2000,
                category: "calzado",
                description: "botines",
                title: "botines de fútbol"
            },
            {
                code: "11118",
                stock: 5,
                price: 800,
                category: "accesorios",
                description: "mochila",
                title: "mochila escolar"
            },
            {
                code: "11119",
                stock: 13,
                price: 1200,
                category: "ropa",
                description: "pantalón",
                title: "pantalón cargo"
            },
            {
                code: "11120",
                stock: 30,
                price: 150,
                category: "accesorios",
                description: "gorro",
                title: "gorro de invierno"
            }
        ]);

        res.status(201).json({ message: "Productos insertados correctamente", result });
    } catch (error) {
        console.log("Error al insertar productos:", error);
        res.status(500).json({ message: "Error al insertar productos", error: error.message });
    }
});

app.use('/api/products/', productRouter);

app.use("/api/carts", cartsRouter)

app.post('/api/carts', async (req, res) => {
    try {
      const newCart = new Cart({ products: [] });  
      await newCart.save();  
      res.status(201).json(newCart);  
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      res.status(500).send({ message: 'Error al crear el carrito' });
    }
  });

app.get('/api/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params; 
        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).send({ message: 'ID de carrito no válido' });
        }
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).send({ message: 'Carrito no encontrado' });
        }
        res.status(200).json(cart)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al obtener el carrito' });
    }
});


app.post('/api/carts/:cid/products', async (req, res) => {
    try {
        const { cid } = req.params;  
        const { pid, quantity } = req.body; 

        if (!pid || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Producto y cantidad son requeridos' });
        }
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (existingProductIndex > -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();  
        res.status(200).json(cart);  

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el producto al carrito' });
    }
});

  

  app.put('/api/carts/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        const product = await Product.findById(req.params.pid);
        
        if (!cart || !product) {
            return res.status(404).send({ message: 'Carrito o producto no encontrado' });
        }
        
        await updateProductInCart(req, res);
        
        
        const updatedCart = await Cart.findById(req.params.cid).populate('products.product');
        return res.status(200).render('index', { layout: 'main', cart: updatedCart });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al actualizar el carrito' });
    }
});




app.use('/static', express.static(path.join(__dirname, 'public')));
