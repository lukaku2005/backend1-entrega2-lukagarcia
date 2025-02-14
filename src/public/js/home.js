const socket = io()

socket.on("home", (data) => {
    console.log("Productos recibidos:", data)

    const productosContenedor = document.querySelector(".productos-contenedor")

    if (!productosContenedor) {
        console.warn("No se encontró el contenedor de productos.")
        return;
    }

    productosContenedor.innerHTML = ""

    data.forEach(product => {
        console.log("Producto individual:", product)

        const div = document.createElement("div")
        div.classList.add("producto") 

        const titulo = document.createElement("p")
        titulo.innerText = product.title || "Sin título"

        const desc = document.createElement("p");
        desc.innerText = product.description || "Sin descripción"

        const precio = document.createElement("p")
        precio.innerText = `$${product.price || "N/A"}`

        div.appendChild(titulo)
        div.appendChild(desc)
        div.appendChild(precio)

        productosContenedor.appendChild(div)
    });
});