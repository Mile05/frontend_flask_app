document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');

    // Función para cargar y mostrar la lista de productos
    async function cargarProductos() {
        try {
            const response = await fetch('http://localhost:5000/productos');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const productos = await response.json();

            productList.innerHTML = ''; // Limpiar lista antes de mostrar los productos

            productos.forEach(producto => {
                const listItem = document.createElement('li');
                listItem.textContent = `${producto.name} - $${producto.price} - Stock: ${producto.stock}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Eliminar';
                deleteButton.addEventListener('click', async () => {
                    try {
                        const response = await fetch(`http://localhost:5000/eliminar_producto/${producto.id}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            throw new Error('Failed to delete product');
                        }
                        listItem.remove(); // Eliminar el elemento de la lista
                    } catch (error) {
                        console.error('Error al eliminar el producto:', error);
                    }
                });

                listItem.appendChild(deleteButton);
                productList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    }

    cargarProductos(); // Cargar productos al cargar la página

    // Evento para manejar la creación de un nuevo producto
    productForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const stock = document.getElementById('productStock').value;

        try {
            const response = await fetch('http://localhost:5000/crear_producto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, price, stock })
            });
            if (!response.ok) {
                throw new Error('Failed to create product');
            }
            cargarProductos(); // Recargar la lista de productos después de crear uno nuevo
            productForm.reset(); // Limpiar el formulario después de crear un producto
        } catch (error) {
            console.error('Error al crear el producto:', error);
        }
    });
});
