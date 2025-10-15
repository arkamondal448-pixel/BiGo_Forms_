const form = document.getElementById("loginForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const phone = form.phone.value.trim();

  status.innerText = "Checking...";

  // ⚙️ Replace with your Google Apps Script web app URL
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbz6Y4UhP7uvHE9xba4Z6tKpSCHGy7Xugc_KRtU_Zps1Emm5t5kkF4L8SsYLnSjR2JUHOg/exec";

  try {
    const response = await fetch(`${WEB_APP_URL}?action=checkStatus&phone=${phone}`);
    const result = await response.json();

    const statusText = (result.status || "").toLowerCase();

    if (statusText === "not_found" || statusText === "interview pending" || statusText === "") {
      // New or pending → interview form
      window.location.href = `interview.html?phone=${phone}`;
    } 
    else if (statusText === "all done") {
      // Interview done → training form
      window.location.href = `followup2.html?phone=${phone}`;
    } 
    else if (statusText === "all done") {
      // Training done → BGV form
      window.location.href = `bgv.html?phone=${phone}`;
    } 
    else if (statusText === "verified") {
      // Process completed
      status.innerText = "✅ Process Completed!";
    } 
    else {
      // Default → interview form
      window.location.href = `interview.html?phone=${phone}`;
    }

  } catch (err) {
    status.innerText = "❌ Error: " + err.message;
  }
});