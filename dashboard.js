document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const productCategorySelect = document.getElementById('productCategory');

    const createProductBtn = document.getElementById('createProductBtn');

    const logout = document.getElementById('logout');

    logout.addEventListener('click', async function(event) {
        event.preventDefault();
        try {
            sessionStorage.removeItem('access_token');

            setTimeout(() => {
                window.location.href = 'home.html';
            }, 100);
            
        } catch (error) {
            console.error('Error al crear el producto:', error);
        }
    });

    function getToken() {
        return sessionStorage.getItem('access_token');
    }

    cargarCategorias();

    async function cargarCategorias() {
        try {
            const response = await fetch('http://localhost:8000/categories/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const categories = await response.json();
            // Limpiamos el dropdown por si acaso hay opciones previas
            productCategorySelect.innerHTML = '<option value="" disabled selected>Selecciona una categoría</option>';
            // Llenamos el dropdown con las categorías obtenidas
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                productCategorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar las categorías:', error);
        }
    }

    async function cargarProductos() {
        try {
            const token = getToken();
            const response = await fetch('http://localhost:8000/products/products', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const productos = await response.json();

            productList.innerHTML = '';

            productos.forEach(producto => {
                const listItem = document.createElement('li');
                listItem.textContent = `${producto.name} - $${producto.price} - Stock: ${producto.stock}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Eliminar';
                // deleteButton.type = "button";
                deleteButton.id = "deleteButton"
                deleteButton.addEventListener('click', async () => {
                    try {
                        const response = await fetch(`http://localhost:8000/products/products/${producto.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            }
                        });
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.detail || 'Failed to delete product');
                        }
                        listItem.remove();
                    } catch (error) {
                        console.error('Error al eliminar el producto:', error);
                        alert(`Error al eliminar el producto: ${error.message}`);
                    }
                });

                listItem.appendChild(deleteButton);
                productList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    }

    cargarProductos();

    productForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const stock = document.getElementById('productStock').value;
        const categoryId = productCategorySelect.value;

        try {
            const token = getToken();
            const response = await fetch('http://localhost:8000/products/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, price, stock, category_id: parseInt(categoryId) }) // Parseamos categoryId a entero
            });
            if (!response.ok) {
                throw new Error('Failed to create product');
            }
            await cargarProductos(); // Esperamos a que se carguen los productos antes de limpiar el formulario y actualizar la lista
            productForm.reset(); // Limpiamos el formulario después de crear el producto
        } catch (error) {
            console.error('Error al crear el producto:', error);
        }
    });

    createProductBtn.addEventListener('click', async function(event) {
        event.preventDefault();

        const name = document.getElementById('productName').value;
        const price = document.getElementById('productPrice').value;
        const stock = document.getElementById('productStock').value;
        const categoryId = productCategorySelect.value;

        try {
            const token = getToken();
            const response = await fetch('http://localhost:8000/products/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, price, stock, category_id: parseInt(categoryId) })
            });
            if (!response.ok) {
                throw new Error('Failed to create product');
            }
            await cargarProductos(); // Esperamos a que se carguen los productos antes de limpiar el formulario y actualizar la lista
            productForm.reset(); // Limpiamos el formulario después de crear el producto
        } catch (error) {
            console.error('Error al crear el producto:', error);
        }
    });
});
