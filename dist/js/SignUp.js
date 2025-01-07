// Menu button
document.getElementById('menu-btn').addEventListener('click', function () {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

// Password icon
function togglePassword() {
  const passwordField = document.getElementById('password');
  const toggleText = document.getElementById('toggle-text');

  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    toggleText.innerHTML = '<i class="fa-regular fa-eye"></i>';
  } else {
    passwordField.type = 'password';
    toggleText.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
  }
}

  //loader
  function showLoader() {
    const loaderElement = document.getElementById("loader");
    if (loaderElement && loaderElement.classList.contains("hidden")) {
        console.log("Showing loader");
        loaderElement.classList.remove("hidden");
    } else {
        console.log("Loader is already visible");
    }
  }
  
  function hideLoader() {
    const loaderElement = document.getElementById("loader");
    if (loaderElement && !loaderElement.classList.contains("hidden")) {
        console.log("Hiding loader");
        loaderElement.classList.add("hidden");
    } else {
        console.log("Loader is already hidden");
      }
  }

async function submitForm() {
  // Get form values
  const username = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const role = document.querySelector("input[name='role']:checked");
  const password = document.getElementById("password").value;

  // Basic Validation
  if (!username || !phone || !role || !password) {
    alert("Please fill in all fields.");
    return;
  }
  
  if (phone.length !== 10) {
    alert("Phone number must be exactly 10 digits.");
    return;
  }

  try {
    showLoader();
    console.log("Submitting form with data:", { username, phone, role: role.value, password });

    const response = await fetch('https://feedback-system-backend-p8f5.onrender.com/api/user/signup', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, phone, role: role.value, password }),
    });

    if (response.ok) {
      const result = await response.json();

      if (result.status === "ACCEPTED") {
        alert("Signup successful!");
        window.location.href = "/Index.html";  
      } else {
        const errorMessage = result.errorMessage || "Please try again.";
        alert("Signup failed: " + errorMessage);
      }
    } else {
      const errorData = await response.json();

      if (errorData.errorMessage === "Phone Number Already Exists!") {
        alert("This phone number is already registered.");
      } else {
        alert("Signup failed: " + (errorData.errorMessage || "Please try again."));
      }
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Network error. Please check your connection and try again.");
  }finally{
    hideLoader();
  }
}
