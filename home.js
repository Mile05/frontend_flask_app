document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/usuarios');
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            const usuarios = await response.json();

            const usuarioEncontrado = usuarios.find(usuario => usuario.username === username && usuario.password === password);
            if (usuarioEncontrado) {
                alert('¡Inicio de sesión exitoso!');
                
                window.location.href = 'dashboard.html';
            } else {
                alert('Nombre de usuario o contraseña incorrectos. Por favor, inténtelo de nuevo.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al intentar iniciar sesión. Por favor, inténtelo de nuevo más tarde.');
        }
    });
});
