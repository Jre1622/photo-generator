document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("signUpModal");
  const signUpBtn = document.getElementById("signUpBtn");
  const closeBtn = document.getElementsByClassName("close")[0];
  const registerForm = document.getElementById("registerForm");
  const messageDiv = document.getElementById("message");

  // Open the modal when Sign Up button is clicked
  signUpBtn.onclick = () => {
    modal.style.display = "block";
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

  // Handle form submission
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const rawText = await response.text();
      console.log("Raw response:", rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        throw new Error("Server response was not valid JSON");
      }

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      messageDiv.textContent = "Registration successful!";
      messageDiv.style.color = "green";
    } catch (error) {
      console.error("Error:", error);
      messageDiv.textContent = error.message;
      messageDiv.style.color = "red";
    }
  });
});
