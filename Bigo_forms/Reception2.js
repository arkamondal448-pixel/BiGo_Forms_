document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("receptionForm");
  const purposeSelect = document.getElementById("purpose");
  const otherPurposeGroup = document.getElementById("otherPurposeGroup");

  // ✅ Replace with your deployed Google Apps Script Web App URL
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwf_M52uzhdiLdP1UZSRfac_VJ0_fLgcj7rkWH8G1jq28s4oyACjAY52eQZUMLhEHvl/exec";

  // Show/hide "Other Purpose" input
  purposeSelect.addEventListener("change", () => {
    if (purposeSelect.value === "other") {
      otherPurposeGroup.classList.remove("hidden");
    } else {
      otherPurposeGroup.classList.add("hidden");
    }
  });

  // Handle form submission
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
      // Send form data to Apps Script
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        const purpose = formData.purpose.toLowerCase();

        // Redirect or alert based on purpose
        if (purpose === "interview") {
          alert("✅ Interview details submitted! You’ll receive a WhatsApp message shortly.");
          // Optional: redirect if you have a separate page
          // window.location.href = "interview.html";
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
      } else {
        console.error("❌ Apps Script response error:", result);
        alert("⚠️ Submission failed! Please try again.");
      }
    } catch (err) {
      console.error("❌ Error submitting data:", err);
      alert("❌ Error submitting data!");
    }
  });
});
