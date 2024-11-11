// Menu button
document.getElementById('menu-btn').addEventListener('click', function () {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("form");
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

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    const phone = phoneInput.value.trim();
    const password = passwordInput.value.trim();
  
    if (!phone || !password) {
      alert("Please enter both phone number and password.");
      return;
    }
  
    try {
      const response = await fetch('https://feedback-system-backend-8kgm.onrender.com/api/user/login', {
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
          sessionStorage.setItem('user',JSON.stringify(data));

          const user = JSON.parse(sessionStorage.getItem('user'));
          console.log(user.role);
          if(user.role == "admin"){
            window.location.href = "/dist/html/AdminConsole/CourseAdmin.html";
          }else{
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
    }
  });
});
