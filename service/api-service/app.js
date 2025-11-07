const express = require("express");
const bodyParser = require("body-parser");
const connector = require("./src/connector/db-connector");
var port = process.env.SERVER_PORT || 3000;
const app = express();
const sessions = require("express-session");
const cron = require("node-cron");
var http = require("http").Server(app);
app.use(bodyParser.json());
const dbModels = require("./src/model/init-model");
const scheduleService = require("./src/service/schedule-service");
const cors = require("cors");
const moment = require("moment-timezone");
const logger = require("./logger");
const path = require("path");
app.use(
  cors({
    origin: "*",
  })
);
// / creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: true,
  })
);

connector.sequelize
  .authenticate()
  .then(() => {
    console.log("database connected!");
  })
  .catch((err) => {
    console.log("Error Creating database connection " + err);
  });

connector.sequelize
  .sync()
  .then((res) => {
    console.log("Database synchronised");
    const server = app.listen(port, () => {
      console.log("server is running on ");
    });
  })
  .catch((err) => {
    console.log("database synchronise failed!!!" + err);
  });

const authRoute = require("./src/router/auth-route");
const configRoute = require("./src/router/app-config-route");
const serviceRoute = require("./src/router/service-route");
const communityRoute = require("./src/router/community-route");
const taskRoute = require("./src/router/task-rote");
const jobOrderRoute = require("./src/router/job-order-route");
const billingRoute = require("./src/router/billing-route");
const smsRoute = require("./src/router/sms-route");
const eventRoute = require("./src/router/event-route");
// Run every day at 06:00 AM in Florida (Eastern Time)
// Task Generator
cron.schedule(
  "24 8 * * *", // Runs at 6.00 AM EDT/EST
  async () => {
    const todayEDT = moment().tz("America/New_York").format("YYYY-MM-DD");
    const currentDay = moment()
      .tz("America/New_York")
      .format("dddd")
      .toLowerCase();

    logger.info("Cron job started for daily task generation", {
      date: todayEDT,
    });
    
    try {
      let response = await scheduleService.generateDailyTasks(
        todayEDT,
        currentDay
      );
      logger.info("Cron job completed for daily task generation", {
        date: todayEDT,
        status: response,
      });
    } catch (error) {
      logger.error("Cron job failed for daily task generation", {
        date: todayEDT,
        error: error.message,
        stack: error.stack,
      });

      // Don't re-throw the error to prevent the cron from stopping
    }
  },
  {
    timezone: "America/New_York",
    scheduled: true,
  }
);

// invoice generator
cron.schedule(
  "56 11 * * *", // Runs at 7.00 PM EDT/EST
  async () => {
    const todayEDT = moment().tz("America/New_York").format("YYYY-MM-DD");
    logger.info("Cron job started for Invoice generation", {
      date: todayEDT, // Date in EDT/EST
    });
    try {
      // const response = await scheduleService.generateInvoice();
      logger.info("Cron job completed for invoice generation", {
        date: todayEDT,
        status: response,
      });
    } catch (error) {
      logger.error("Cron job failed for invoice generation", {
        date: todayEDT,
        error: error.message,
        stack: error.stack,
      });
    }
  },
  {
    timezone: "America/New_York", // EDT/EST handled automatically
    scheduled: true,
  }
);
// Event Generator
cron.schedule(
  "0 7 * * *", // Runs at 7.00 AM EDT/EST
  async () => {
    const todayEDT = moment().tz("America/New_York").format("YYYY-MM-DD");
    logger.info("Cron job started for daily Event generation", {
      date: todayEDT, // Date in EDT/EST
    });
    try {
      const response = await scheduleService.generateDailyEvent(todayEDT);
      logger.info("Cron job completed for daily Event generation", {
        date: todayEDT,
        status: response,
      });
    } catch (error) {
      logger.error("Cron job failed for daily Event generation", {
        date: todayEDT,
        error: error.message,
        stack: error.stack,
      });
    }
  },
  {
    timezone: "America/New_York", // EDT/EST handled automatically
    scheduled: true,
  }
);

app.use("/api/auth", authRoute);
app.use("/api/config", configRoute);
app.use("/api/service", serviceRoute);
app.use("/api/community", communityRoute);
app.use("/api/task", taskRoute);
app.use("/api/job-order", jobOrderRoute);
app.use("/api/billing", billingRoute);
app.use("/api/sms", smsRoute);
app.use("/api/event", eventRoute);
app.get("/api/stayawake", (req, res) => {
  const now = moment().tz("America/New_York").format("MM-DD-YYYY HH:mm:ss");
  res.send("I am Awake at " + now);
});
// Serve static uploaded files
app.use("/api/images", express.static(path.join(__dirname, "images")));