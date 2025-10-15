

const form = document.getElementById("interviewForm"); 
const experience = document.getElementById("experience");
const extraFields = document.getElementById("extraFields");
const interviewType = document.getElementById("interviewType");
const skillsSection = document.getElementById("skillsSection");
const cvSection = document.getElementById("cvSection");
const status = document.getElementById("status");

// 🔹 Auto-fill phone number from login
const urlParams = new URLSearchParams(window.location.search);
const phoneFromLogin = urlParams.get("phone");
if (phoneFromLogin) {
  document.getElementById("contact").value = phoneFromLogin;
}

// 🔹 Show/hide extra fields based on experience
experience.addEventListener("change", () => {
  if (experience.value === "Fresher" || experience.value === "") {
    extraFields.classList.add("hidden");
  } else {
    extraFields.classList.remove("hidden");
  }
});

// 🔹 Show/hide sections based on interview type
interviewType.addEventListener("change", () => {
  const value = interviewType.value;
  if (value === "Sir") {
    skillsSection.style.display = "block";
    cvSection.style.display = "block";
  } else {
    skillsSection.style.display = "none";
    cvSection.style.display = "none";
  }
});

// 🔹 Submit form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedType = interviewType.value;

  if (selectedType === "Sir") {
    const fileInput = document.getElementById("cv");
    const file = fileInput.files[0];
    if (!file) {
      status.innerText = "⚠️ Please upload your CV before submitting.";
      return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
      sendData(event.target.result.split(",")[1], file.name);
    };
    reader.readAsDataURL(file);
  } else {
    sendData(null, null);
  }
});

function sendData(base64Data, filename) {
  const data = {
    formType: "interview",
    interviewType: interviewType.value,
    fullname: form.fullname.value,
    contact: form.contact.value,
    email: form.email.value,
    currentAddress: form.currentAddress.value,
    permanentAddress: form.permanentAddress.value,
    position: form.position.value,
    experience: form.experience.value,
    company: form.company.value,
    ctc: form.ctc.value,
    skills: form.skills.value,
    qualification: form.qualification.value,
    cv_base64: base64Data,
    cv_filename: filename
  };

  status.innerText = "⏳ Submitting...";

  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwgo9tffcg0H9wXTBx0TTbn_fztlZK-f8Ot1eEvU7wCfVdPEl02pfDG5yExkgogeH407Q/exec"; // replace with your Apps Script URL

  fetch(WEB_APP_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "text/plain" }
  })
  .then(response => response.json())
  .then(result => {
    status.innerText = result.message || "✅ Submitted successfully!";
    form.reset();
    extraFields.classList.add("hidden");
    skillsSection.style.display = "block";
    cvSection.style.display = "block";

    // Optional: Show CV link after submission if available
    if (result.cvLink) {
      const linkEl = document.createElement("a");
      linkEl.href = result.cvLink;
      linkEl.target = "_blank";
      linkEl.innerText = "View your uploaded CV";
      status.appendChild(document.createElement("br"));
      status.appendChild(linkEl);
    }
  })
  .catch(err => {
    status.innerText = "❌ Error: " + err.message;
  });
}