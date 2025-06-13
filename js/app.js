import { login, cadastrarUsuario } from './auth.js';

const setupForm = (buttonId, callback) => {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const container = button.closest('.login-container');
            if (!container) {
                console.error('Container não encontrado');
                return;
            }
            const errorElement = container.querySelector('.error-message');

            try {
                errorElement.style.display = 'none';
                await callback();
            } catch (error) {
                errorElement.textContent = error.message;
                errorElement.style.color = 'red';
                errorElement.style.display = 'block';
            }
        });
    }
};

setupForm('login-button', async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        throw new Error('Preencha todos os campos');
    }

    const result = await login(email, password);
    if (!result.success) {
        throw new Error(result.message);
    }

    window.location.href = "indexlogin.html";
});

setupForm('signin-button', async () => {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const errorElement = document.getElementById('signup-error');

    if (!email || !password) {
        throw new Error('Preencha todos os campos');
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        throw new Error('Email inválido');
    }

    const result = await cadastrarUsuario(email, password);
    if (!result.success) {
        throw new Error(result.message);
    }

    errorElement.textContent = 'Cadastro realizado com sucesso!';
    errorElement.style.color = 'green';
    errorElement.style.display = 'block';

    // Limpar os campos após 3 segundos
    setTimeout(() => {
        document.querySelectorAll('#signup-container input').forEach(input => {
            input.value = '';
        });
        errorElement.style.display = 'none';
    }, 3000);
});