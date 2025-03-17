
    // Logout Popup Functionality
    function showLogoutPopup() {
        document.getElementById('logoutPopup').style.display = 'flex';
    }

    function hideLogoutPopup() {
        document.getElementById('logoutPopup').style.display = 'none';
    }

    document.getElementById('confirmLogout').addEventListener('click', function () {
        alert('You have been logged out.'); // Replace with actual logout logic
        hideLogoutPopup();
        window.location.href = 'index.html'; // Redirect to login page
    });

    document.getElementById('cancelLogout').addEventListener('click', hideLogoutPopup);

    // Show logout popup when the logout link is clicked
    document.getElementById('logoutLink').addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default link behavior
        showLogoutPopup();
    });