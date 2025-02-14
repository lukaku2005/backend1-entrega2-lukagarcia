import { promises as fs } from "fs";

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.cargarArray();
    }

    async cargarArray() {
        try {
            this.products = await this.leerArchivo();
        } catch {
            await this.guardarArchivo([]);
        }
    }

    async leerArchivo() {
        const data = await fs.readFile(this.path, "utf-8");
        return JSON.parse(data);
    }

    async guardarArchivo(arrayProductos) {
        await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    }

    async getProducts() {
        return await this.leerArchivo()
    }
    

    async getProductById(id) {
        return this.products.find(p => p.id === id) || null;
    }

    async addProduct(producto) {
        const newId = this.products.length ? this.products[this.products.length - 1].id + 1 : 1;
        const nuevoProducto = { id: newId, ...producto };
        this.products.push(nuevoProducto);
        await this.guardarArchivo(this.products);
    }
}

export default ProductManager;