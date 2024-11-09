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

 async function submitForm() {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const role = document.querySelector("input[name='role']:checked").value;
    const password = document.getElementById("password").value;

    try{
      const response = await fetch('http://localhost:8080/api/user/signup',{
        method : "POST",
        headers : {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, phone, role, password }),
      });
      if(response.ok){
        const data = await response.json();
        alert("Signup successful!");
        window.location.href = "/dist/html/signIn.html";
      }else {
        return response.json().then(data => {
          alert("Signup failed: " + (data.message || "Please try again."));
        });
      }
    }catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check your connection and try again.");
    }
  }



