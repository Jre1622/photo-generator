document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("authModal");
  const authBtn = document.getElementById("authBtn");
  const closeBtn = document.getElementsByClassName("close")[0];
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const messageDiv = document.getElementById("message");
  const authTabs = document.querySelectorAll(".auth-tab");

  // Open the modal when Auth button is clicked
  authBtn.onclick = () => {
    modal.style.display = "block";
    // Ensure the correct form is displayed initially
    loginForm.style.display = "block";
    registerForm.style.display = "none";
  };

  // Close the modal when 'x' is clicked
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  // Close the modal when clicking outside of it
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Tab switching logic
  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      authTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      if (tab.dataset.tab === "login") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
      } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
      }
    });
  });

  // Handle register form submission
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      messageDiv.textContent = "Registration successful!";
      messageDiv.style.color = "green";
    } catch (error) {
      messageDiv.textContent = error.message;
      messageDiv.style.color = "red";
    }
  });

  // Handle login form submission (to be implemented)
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Login logic to be implemented
  });
});
