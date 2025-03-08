import { Product } from '../models/product.model.js';

export const getAllProducts = async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        if (isNaN(limit) || limit <= 0) limit = 10;
        if (isNaN(page) || page <= 0) page = 1;

        const filter = {};
        if (query === 'true' || query === 'false') {
            filter.status = query === 'true';
        } else if (query) {
            filter.category = query;
        }

        let sortOption = {};
        if (sort === 'asc') {
            sortOption.price = 1;
        } else if (sort === 'desc') {
            sortOption.price = -1;
        }

        const options = {
            page,
            limit,
            sort: sortOption,
            lean: true
        };

        const result = await Product.paginate(filter, options);

        res.status(200).render('templates/home', {
            productos: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};


export const getProductById = async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const producto = await Product.findById(idProducto);

    if (!producto) {
      return res.status(404).send({ mensaje: 'El producto no existe' });
    }

    res.status(200).render('templates/productDetails', { producto });
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: 'Hubo un error al buscar el producto' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, code, price, stock, category } = req.body;

    const newProduct = await Product.create({
      title,
      description,
      code,
      price,
      stock,
      status: true,
      category,
      thumbnails: []
    });

    res.status(201).send({ mensaje: `Producto creado con el id ${newProduct._id}` });
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: 'Hubo un error al crear el producto' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const idProducto = req.params.pid;
    const { title, description, code, price, stock, status, category, thumbnails } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      idProducto,
      { title, description, code, price, stock, status, category, thumbnails },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ mensaje: 'El producto no existe' });
    }

    res.status(200).send({ mensaje: `Producto con el id ${idProducto} fue modificado` });
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: 'Error al actualizar el producto' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const idProducto = req.params.pid;

    const deletedProduct = await Product.findByIdAndDelete(idProducto);

    if (!deletedProduct) {
      return res.status(404).send({ mensaje: 'El producto no existe' });
    }

    res.status(200).send({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ mensaje: 'Error al eliminar el producto' });
  }
};
