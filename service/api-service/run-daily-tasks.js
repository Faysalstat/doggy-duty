const axios = require("axios");
const moment = require("moment-timezone");

async function callCronApi() {
  try {
    const res = await axios.get("https://doggyduty.live/api/stayawake");
    const now = moment().tz("America/New_York");
    if (now.hour() === 3) {
      // It is 2:30 AM in America/New_York timezone
      console.log("It is 3.00 AM. Ready to generate the task");
    }

    console.log("Cron API response:", res.data);
  } catch (err) {
    console.error("Failed to call cron API:", err.message);
  } finally {
    process.exit();
  }
}

callCronApi();
