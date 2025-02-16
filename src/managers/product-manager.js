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
        try {
            const data = await fs.readFile(this.path, "utf-8")
            return data ? JSON.parse(data) : []
        } catch (error) {
            return []
        }
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

    async updateProduct(updatedProduct, id) {
        await this.getProducts()
        
        const index = this.products.findIndex(p => p.id == id);
        if (index === -1) {
            console.log("ID no encontrado")
            return
        }
    
        this.products[index] = { ...this.products[index], ...updatedProduct, id }
        await this.guardarArchivo(this.products)
        console.log("Producto actualizado")
    }

    async deleteProduct(id) {
        await this.getProducts()
        const index = this.products.findIndex(obj => obj.id == id)
        if (index !== -1) {
            this.products.splice(index, 1)
            await this.guardarArchivo(this.products)
            console.log("Producto Eliminado")
        } else {
            console.log("ID no encontrado")
        }
    }
}

export default ProductManager;