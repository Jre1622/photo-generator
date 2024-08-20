document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("authModal");
  const authBtn = document.getElementById("authBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const closeBtn = document.getElementsByClassName("close")[0];
  const loginForm = document.getElementById("loginFormElement");
  const registerForm = document.getElementById("registerFormElement");
  const messageDiv = document.getElementById("message");
  const authTabs = document.querySelectorAll(".auth-tab");
  const authForms = document.querySelectorAll(".auth-form");

  if (authBtn) {
    authBtn.onclick = showAuthModal;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  // Close the modal when 'x' is clicked
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = "none";
    };
  }

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
      authForms.forEach((f) => f.classList.remove("active"));
      tab.classList.add("active");
      const formId = `${tab.dataset.tab}Form`;
      document.getElementById(formId).classList.add("active");
    });
  });

  // Handle register form submission
  if (registerForm) {
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

        messageDiv.textContent = "Registration successful! Please log in.";
        messageDiv.style.color = "green";

        // Clear the registration form
        registerForm.reset();

        // Switch to the login tab
        const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
        if (loginTab) {
          loginTab.click();
        }

        // Optionally, you can pre-fill the login email field
        const loginEmail = document.getElementById("loginEmail");
        if (loginEmail) {
          loginEmail.value = email;
        }
      } catch (error) {
        messageDiv.textContent = error.message;
        messageDiv.style.color = "red";
      }
    });
  }

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        const response = await fetch("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        messageDiv.textContent = "Login successful!";
        messageDiv.style.color = "green";
        setTimeout(() => {
          location.reload();
        }, 1500);
      } catch (error) {
        messageDiv.textContent = error.message;
        messageDiv.style.color = "red";
      }
    });
  }
});

function showAuthModal() {
  const modal = document.getElementById("authModal");
  modal.style.display = "block";
}

function logout() {
  fetch("/auth/logout", { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Logged out successfully") {
        location.reload();
      }
    })
    .catch((error) => console.error("Error:", error));
}
