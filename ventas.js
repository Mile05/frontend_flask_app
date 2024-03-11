document.addEventListener('DOMContentLoaded', function() {
    const sellForm = document.getElementById('sellForm');
    const sellList = document.getElementById('sellList');

    // Función para cargar y mostrar la lista de ventas
    async function cargarVentas() {
        try {
            const response = await fetch('http://localhost:5000/ventas');
            if (!response.ok) {
                throw new Error('Failed to fetch sales');
            }
            const ventas = await response.json();

            sellList.innerHTML = ''; // Limpiar lista antes de mostrar las ventas

            ventas.forEach(venta => {
                const listItem = document.createElement('li');
                listItem.textContent = `${venta.quantity} - ${venta.observation} - Producto: ${venta.product_name}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Eliminar';
                deleteButton.addEventListener('click', async () => {
                    try {
                        const response = await fetch(`http://localhost:5000/eliminar_venta/${venta.id}`, {
                            method: 'DELETE'
                        });
                        if (!response.ok) {
                            throw new Error('Failed to delete sale');
                        }
                        listItem.remove(); // Eliminar el elemento de la lista
                    } catch (error) {
                        console.error('Error al eliminar la venta:', error);
                    }
                });

                listItem.appendChild(deleteButton);
                sellList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error al cargar las ventas:', error);
        }
    }

    cargarVentas(); // Cargar ventas al cargar la página

    // Evento para manejar la creación de una nueva venta
    sellForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const quantity = document.getElementById('sellQuantity').value;
        const observation = document.getElementById('sellObservation').value;
        const id_product = document.getElementById('sellProductId').value;

        try {
            const response = await fetch('http://localhost:5000/crear_venta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity, observation, id_product })
            });
            if (!response.ok) {
                throw new Error('Failed to create sale');
            }
            cargarVentas(); // Recargar la lista de ventas después de crear una nueva
            sellForm.reset(); // Limpiar el formulario después de crear una venta
        } catch (error) {
            console.error('Error al crear la venta:', error);
        }
    });
});
