document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:8000/oauth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'username': username,
                    'password': password
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    alert('Nombre de usuario o contraseña incorrectos. Por favor, inténtelo de nuevo.');
                } else {
                    throw new Error('Failed to fetch');
                }
            } else {
                const data = await response.json();
                const accessToken = data.access_token;
                
                alert('¡Inicio de sesión exitoso!');
                console.log('Access Token:', accessToken);
                
                // You can store the token in localStorage or sessionStorage if needed
                sessionStorage.setItem('access_token', accessToken);

                // Redirect to dashboard or another page
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 100);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al intentar iniciar sesión. Por favor, inténtelo de nuevo más tarde.');
        }
    });
});
