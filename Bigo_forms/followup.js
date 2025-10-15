document.addEventListener("DOMContentLoaded", () => {
  const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbyOyYWG-ckl19KXrlVUOy-4GaevnsRN6dkt4csc6oU8AsDRA_2nbkfRh5WlD9Kwxlqgnw/exec";

  const phoneCheckForm = document.getElementById("phoneCheckForm");
  const followupForm = document.getElementById("followupForm");

  let currentPhone = "";

  // Step 1️⃣ — Lookup phone number
  phoneCheckForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const phone = document.getElementById("phoneLookup").value.trim();
    if (!phone) return alert("Please enter a phone number");

    currentPhone = phone;

    try {
      const res = await fetch(`${WEB_APP_URL}?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();

      if (data.success) {
        phoneCheckForm.classList.add("hidden");
        followupForm.classList.remove("hidden");

        document.getElementById("f_visitorName").value = data.visitorName;
        document.getElementById("f_email").value = data.email;
        document.getElementById("f_altNumber").value = data.altNumber;
        document.getElementById("f_area").value = data.area;
        document.getElementById("f_reference").value = data.reference;
        document.getElementById("f_trainingType").value = data.trainingType;
        document.getElementById("f_previousJob").value = data.previousJob;
      } else {
        alert("⚠️ Record not found. Please register via the Training form first.");
      }
    } catch (err) {
      alert("❌ Error fetching record.");
      console.error(err);
    }
  });

  // Step 2️⃣ — Submit follow-up form
  followupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      formType: "followup",
      phone: currentPhone,
      interviewBy: document.getElementById("interviewBy").value.trim(),
      trainingBy: document.getElementById("trainingBy").value.trim(),
      trainingStatus: document.getElementById("trainingStatus").value.trim(),
      trainedBy: document.getElementById("trainedBy").value.trim(),
      selection: document.getElementById("selection").value.trim(),
      finalRemark: document.getElementById("finalRemark").value.trim(),
    };

    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        alert("✅ Follow-up data submitted successfully!");
        if (data.selection.toLowerCase() === "yes") {
          alert("Redirecting to BGV form...");
          window.location.href = "index2.html";
        } else {
          followupForm.reset();
          followupForm.classList.add("hidden");
          phoneCheckForm.classList.remove("hidden");
        }
      } else {
        alert("⚠️ " + result.message);
      }
    } catch (err) {
      alert("❌ Error submitting follow-up data!");
      console.error(err);
    }
  });
});
