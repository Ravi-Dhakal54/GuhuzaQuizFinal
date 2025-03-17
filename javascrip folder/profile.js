document.addEventListener('DOMContentLoaded', async function () {
  const username = localStorage.getItem('username'); // Get the logged-in username
  if (!username) {
    alert('Please log in to view your profile.');
    window.location.href = 'login.html';
    return;
  }

  // Fetch user data from the backend
  let user = null;
  try {
    const response = await fetch(`/user-data?username=${username}`);
    if (!response.ok) throw new Error('Failed to fetch user data');
    user = await response.json();
  } catch (err) {
    console.error('Error fetching user data:', err);
    alert('Failed to load user data. Please try again later.');
    return;
  }

  // Initialize user info on page load
  document.getElementById("username").textContent = user.username;
  document.getElementById("user-email").textContent = user.email;
  document.getElementById("user-phone").textContent = user.phone;
  document.getElementById("join-date").textContent = new Date(user.createdAt).toLocaleDateString();
  document.getElementById("profilePic").src = user.profilePic || 'default-profile.png';

  // Function to open the modal
  window.openModal = function () {
    // Pre-fill the form with current user data
    document.getElementById("newEmail").value = user.email;
    document.getElementById("newPhone").value = user.phone;
    document.getElementById("updateModal").style.display = "flex";
  };

  // Function to close the modal
  window.closeModal = function () {
    document.getElementById("updateModal").style.display = "none";
  };

  // Function to update user info
  window.updateUserInfo = async function () {
    const newEmail = document.getElementById("newEmail").value;
    const newPhone = document.getElementById("newPhone").value;
    const newPassword = document.getElementById("newPassword").value;
    const newProfilePic = document.getElementById("previewPic").src;

    // Prepare the updated data
    const updatedData = {
      email: newEmail || user.email,
      phone: newPhone || user.phone,
      password: newPassword || user.password,
      profilePic: newProfilePic || user.profilePic,
    };

    // Send the updated data to the backend
    try {
      const response = await fetch(`/update-user/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update user info');
      const result = await response.json();
      alert(result.message);

      // Update the displayed user info
      user = { ...user, ...updatedData };
      document.getElementById("user-email").textContent = user.email;
      document.getElementById("user-phone").textContent = user.phone;
      document.getElementById("profilePic").src = user.profilePic;

      closeModal();
    } catch (err) {
      console.error('Error updating user info:', err);
      alert('Failed to update user info. Please try again later.');
    }
  };

  // Function to preview profile picture
  window.previewProfilePic = function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('previewPic').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
});