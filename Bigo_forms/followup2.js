// followup.js (or followup2.js — be sure your HTML loads the same name)
const form = document.getElementById("followupForm");
const status = document.getElementById("status");

// Put your deployed web app URL here (update if you redeploy)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyOvVt1Dmz_WO4xzdoAGWPa2rq5D8zOWOGHT9lim47QJ7O8y02ZPw5gF10Wm6WaW2KIdw/exec";

const urlParams = new URLSearchParams(window.location.search);
const phoneFromLogin = urlParams.get("phone");
if (phoneFromLogin) {
  fetchCandidateData(phoneFromLogin);
} else {
  alert("❌ Missing phone number in URL. Please open via a valid link (e.g. ?phone=9876543210).");
}

function fetchCandidateData(phone) {
  status.innerText = "🔍 Fetching candidate details...";
  fetch(`${WEB_APP_URL}?action=getFollowup&phone=${encodeURIComponent(phone)}`)
    .then(res => res.json())
    .then(data => {
      console.log("GET response:", data); // <-- helps debug
      if (data && data.success) {
        const r = data.record || {};

        form.fullname.value = r["Full Name"] || "";
        form.contact.value = r["Contact Number"] || phone;
        form.email.value = r["Email Address"] || "";
        form.currentAddress.value = r["Current Address"] || "";
        form.permanentAddress.value = r["Permanent Address"] || "";
        form.position.value = r["Position"] || "";

        // Lock fetched fields
        form.fullname.readOnly = true;
        form.contact.readOnly = true;
        form.email.readOnly = true;

        status.innerText = "✅ Candidate data loaded successfully.";
      } else {
        // Show backend message if exists
        const msg = (data && data.message) ? data.message : "Record not found in Main sheet.";
        status.innerText = "⚠️ " + msg;
      }
    })
    .catch(err => {
      console.error("Fetch error:", err);
      status.innerText = "❌ Error fetching candidate details.";
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    formType: "followup",
    phone: phoneFromLogin,
    interviewBy: form.interviewBy.value.trim(),
    trainingBy: form.trainingBy.value.trim(),
    trainingStatus: form.trainingStatus.value.trim(),
    trainedBy: form.trainedBy.value.trim(),
    selection: form.selection.value.trim(),
    finalRemark: form.finalRemark.value.trim()
  };

  if (!data.interviewBy || !data.trainingBy) {
    status.innerText = "⚠️ Please fill all required fields.";
    return;
  }

  status.innerText = "⏳ Submitting follow-up data...";
  fetch(WEB_APP_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "text/plain" }
  })
    .then(res => res.json())
    .then(result => {
      console.log("POST response:", result);
      if (result && result.success) {
        status.innerText = "✅ Follow-up submitted successfully!";
        if ((data.selection || "").toLowerCase() === "yes") {
          alert("Redirecting to BGV form...");
          window.location.href = `index2.html?phone=${encodeURIComponent(phoneFromLogin)}`;
        } else {
          form.reset();
        }
      } else {
        status.innerText = "⚠️ Submission failed: " + (result.message || "Unknown error");
      }
    })
    .catch(err => {
      console.error(err);
      status.innerText = "❌ Error submitting follow-up data.";
    });
});
