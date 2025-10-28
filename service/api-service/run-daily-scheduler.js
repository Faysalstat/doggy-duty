const axios = require("axios");
const moment = require("moment-timezone");

async function callCronApi() {
  try {
    const now = moment().tz("America/New_York");
    if (now.hour() === 3 && now.minute() < 30) {
      const date = now.format("YYYY-MM-DD");
      const day = now.format("dddd").toLowerCase();
      const generateUrl = `https://doggyduty.live/api/job-order/generate?date=${date}&day=${day}`;
      const generateRes = await axios.get(generateUrl);
      console.log("Generate API response:", generateRes.data);
    }
  } catch (err) {
    console.error("Failed to call cron API:", err.message);
  } finally {
    process.exit();
  }
}

callCronApi();
