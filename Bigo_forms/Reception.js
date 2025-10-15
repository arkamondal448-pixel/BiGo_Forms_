document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("receptionForm");
  const purposeSelect = document.getElementById("purpose");
  const otherPurposeGroup = document.getElementById("otherPurposeGroup");

  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzxNkIPD7EjCRIDpKACHnqzoPMECU5sBcfoZ1tp87BjXlCSKF5ktzAQN1z8d5vMGrga1w/exec";
  

  purposeSelect.addEventListener("change", () => {
    otherPurposeGroup.classList.toggle("hidden", purposeSelect.value !== "other");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      formType: "reception",
      visitorName: document.getElementById("visitorName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      purpose: document.getElementById("purpose").value.trim(),
      otherPurpose: document.getElementById("otherPurpose").value.trim(),
      department: document.getElementById("department").value.trim(),
      reference: document.getElementById("reference").value.trim(),
    };

    try {
      // Save Reception data to Google Sheet
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" }, // ✅ fixed
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to save data");
      }

      // Redirect based on purpose
      const purpose = formData.purpose.toLowerCase();
      if (purpose === "interview") {
        window.location.href = "interviewType.html"
      } else if (purpose === "training") {
        window.location.href = "indextraining.html";
      } else if (purpose === "bikedelivery") {
        window.location.href = "vehicle.html";
      } else if (purpose === "accessories") {
        window.location.href = "accessories.html";
      } else {
        alert("✅ Reception data saved!");
        form.reset();
        otherPurposeGroup.classList.add("hidden");
      }

    } catch (error) {
      console.error("Error submitting reception data:", error);
      alert("❌ Error submitting data!");
    }
  });
});
