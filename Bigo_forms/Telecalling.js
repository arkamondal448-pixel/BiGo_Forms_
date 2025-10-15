
document.addEventListener("DOMContentLoaded", () => {
  const callType = document.getElementById("callType");
  const clientFields = document.getElementById("clientFields");
  const riderFields = document.getElementById("riderFields");
  const rentalFields = document.getElementById("rentalFields");
  const form = document.getElementById("callingForm");
  const output = document.getElementById("output");

  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzEnIgpg5mo8B0OiDYRtLq1pfWPA9QbNR9P5ftv2swrEJCLDLUwll5GU5EVNat4lKT8HA/exec"; // Replace with your Web App URL

  callType.addEventListener("change", () => {
    clientFields.classList.add("hidden");
    riderFields.classList.add("hidden");
    rentalFields.classList.add("hidden");

    if (callType.value === "client") clientFields.classList.remove("hidden");
    else if (callType.value === "rider") riderFields.classList.remove("hidden");
    else if (callType.value === "rental") rentalFields.classList.remove("hidden");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    output.textContent = "Submitting...";

    const type = callType.value;
    let data = { callType: type };

    if (type === "client") {
      data.storeName = document.getElementById("storeName").value;
      data.number = document.getElementById("clientNumber").value;
      data.remarks = document.getElementById("clientRemarks").value;
    } else if (type === "rider") {
      data.fullName = document.getElementById("riderName").value;
      data.number = document.getElementById("riderNumber").value;
      data.remarks = document.getElementById("riderRemarks").value;
    } else if (type === "rental") {
      data.fullName = document.getElementById("rentalName").value;
      data.number = document.getElementById("rentalNumber").value;
      data.remarks = document.getElementById("rentalRemarks").value;
    } else {
      output.textContent = "❌ Please select a call type!";
      return;
    }

    fetch(WEB_APP_URL, {
  method: "POST",
  body: JSON.stringify(data),
  headers: { "Content-Type": "text/plain" },
})
  .then(async (res) => {
    // Try parsing JSON safely
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      output.textContent = text;
      return;
    }

    if (data.status === "success") {
      output.textContent = "✅ " + data.message;
      form.reset();
      clientFields.classList.add("hidden");
      riderFields.classList.add("hidden");
      rentalFields.classList.add("hidden");
    } else {
      output.textContent = "❌ Something went wrong!";
    }
  })
  .catch((err) => {
    console.error(err);
    output.textContent = "❌ Submission failed — check console.";
  });
  });
  });
