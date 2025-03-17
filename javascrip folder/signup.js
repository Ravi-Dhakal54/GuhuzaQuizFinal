const form = document.getElementById('signupForm');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

// ✅ Toggle password visibility
togglePassword.addEventListener('click', function () {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    this.querySelector('i').classList.toggle('fa-eye-slash');
});

// ✅ Form submission with validation
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    let isValid = true;

    // Username validation
    if (!form.username.value.trim()) {
        document.getElementById('usernameError').textContent = 'Username is required';
        isValid = false;
    }

    // Address validation
    if (!form.address.value.trim()) {
        document.getElementById('addressError').textContent = 'Address is required';
        isValid = false;
    }

    // Phone validation
    if (!form.phone.value.trim()) {
        document.getElementById('phoneError').textContent = 'Phone number is required';
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.value.trim())) {
        document.getElementById('emailError').textContent = 'Email must contain @ and .com';
        isValid = false;
    }

    // Password validation
    if (!form.password.value.trim()) {
        document.getElementById('passwordError').textContent = 'Password is required';
        isValid = false;
    }

    // Confirm Password validation
    if (form.password.value !== form.confirmPassword.value) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
        isValid = false;
    }

    // Terms and Conditions validation
    if (!form.terms.checked) {
        document.getElementById('termsError').textContent = 'You must accept the terms and conditions';
        isValid = false;
    }

    if (!isValid) return;

    // ✅ Submit form data
    const formData = {
        username: form.username.value,
        address: form.address.value,
        phone: form.phone.value,
        email: form.email.value,
        password: form.password.value,
        confirmPassword: form.confirmPassword.value,
    };

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            // Store the username in localStorage
            localStorage.setItem('username', formData.username);

            alert(result.message);
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            document.getElementById('formError').textContent = result.error;
        }
    } catch (err) {
        console.error('Error:', err);
        document.getElementById('formError').textContent = 'An error occurred. Please try again.';
    }
});