document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("#login-form");
  const passwordInput = document.getElementById("password");
  const phoneInput = document.getElementById("phone");
  const toggleText = document.getElementById("toggle-text");

  // Password icon toggle
  function togglePassword() {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    toggleText.innerHTML = type === "password"
      ? '<i class="fa-regular fa-eye-slash"></i>'
      : '<i class="fa-regular fa-eye"></i>';
  }

  toggleText.addEventListener("click", togglePassword);

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

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const phone = phoneInput.value.trim();
    const password = passwordInput.value.trim();

    if (!phone || !password) {
      alert("Please enter both phone number and password.");
      return;
    }

    try {
      showLoader();
      const response = await fetch('https://feedback-system-backend-p8f5.onrender.com/api/user/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data && data.userId != null) {
          sessionStorage.setItem('userId', data.userId);
          sessionStorage.setItem('user', JSON.stringify(data));

          const user = JSON.parse(sessionStorage.getItem('user'));
          console.log("User role:", user.role);
          if (user.role === "admin") {
            window.location.href = "/dist/html/AdminConsole/CourseAdmin.html";
          } else {
            window.location.href = "/dist/html/Course.html";
          }
        } else {
          alert("Error: Invalid login credentials. Please try again.");
        }
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check your connection and try again.");
    }finally{
      hideLoader();
    }
  });
});
