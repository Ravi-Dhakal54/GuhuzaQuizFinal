const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const togglePassword = document.getElementById('togglePassword');

// Toggle password visibility
togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye-slash');
    this.querySelector('i').classList.toggle('fa-eye');
});

// Form submission
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get the username and password
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        // Send the login request to the backend
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || 'Invalid username or password');
        }

        // Parse the response
        const result = await response.json();

        // Store the username in localStorage
        localStorage.setItem('username', username);

        // Redirect to the landing page
        window.location.href = '/landing.html'; // Ensure this path is correct
    } catch (err) {
        console.error('Error during form submission:', err);
        alert(err.message || 'An error occurred. Please try again.');
    }
});

// Real-time validation for username
usernameInput.addEventListener('input', function () {
    if (this.value.trim() !== '') {
        usernameError.style.display = 'none';
        this.classList.remove('input-error');
    }
});

// Real-time validation for password
passwordInput.addEventListener('input', function () {
    if (this.value.trim() !== '') {
        passwordError.style.display = 'none';
        this.classList.remove('input-error');
    }
});