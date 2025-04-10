const axios = require("axios");

async function callCronApi() {
  try {
    const res = await axios.get("https://doggyduty.live/api/job-order/generate");
    console.log("Cron API response:", res.data);
  } catch (err) {
    console.error("Failed to call cron API:", err.message);
  } finally {
    process.exit();
  }
}

callCronApi();