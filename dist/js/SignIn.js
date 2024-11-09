// Menu button
document.getElementById('menu-btn').addEventListener('click', function () {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("form");
  const passwordInput = document.getElementById("password");
  const phoneInput = document.getElementById("phone");
  const toggleText = document.getElementById("toggle-text");

  //password icon 
  function togglePassword() {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    toggleText.innerHTML = type === "password"
      ? '<i class="fa-regular fa-eye-slash"></i>'
      : '<i class="fa-regular fa-eye"></i>';
  }

  toggleText.addEventListener("click", togglePassword);

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    const phone = phoneInput;
    const password = passwordInput;

    try {
      const response = await fetch('http://localhost:8080/api/user/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone.value,
          password: password.value,
        }),
      });
      if (response.ok) {
        const data = await response.json();

        if (data && data.userId != null) {
          sessionStorage.setItem('userId', data.userId);

          window.location.href = "/dist/html/Course.html";
        } else {
          alert("Error: Invalid login credentials. Please try again.");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check your connection and try again.");
    }

  });
});
