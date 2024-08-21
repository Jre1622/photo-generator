document.addEventListener("DOMContentLoaded", () => {
  const generateButton = document.getElementById("generateButton");
  const promptInput = document.getElementById("promptInput");
  const generatedImage = document.getElementById("generatedImage");

  generateButton.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert("Please enter a prompt");
      return;
    }

    try {
      // Check if user is logged in
      const authResponse = await fetch("/api/check-auth");
      const authData = await authResponse.json();

      if (!authData.isAuthenticated) {
        alert("Please log in to generate images");
        return;
      }

      generateButton.disabled = true;
      generateButton.textContent = "Generating...";

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();

      if (data.imageUrl) {
        generatedImage.innerHTML = "";
        const imgElement = document.createElement("img");
        imgElement.src = data.imageUrl;
        imgElement.alt = prompt;
        imgElement.className = "generated-image";
        generatedImage.appendChild(imgElement);
      } else {
        throw new Error("No image URL received");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      generateButton.disabled = false;
      generateButton.textContent = "Generate Image";
    }
  });
});
