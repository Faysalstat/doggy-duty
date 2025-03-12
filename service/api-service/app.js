const express = require("express");
const bodyParser = require("body-parser");
const connector = require("./src/connector/db-connector");
var port = process.env.SERVER_PORT || 3000;
const app = express();
const sessions = require("express-session");
const dbModels = require("./src/model/init-model");

var http = require("http").Server(app);
app.use(bodyParser.json());

const cors = require("cors");
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
const serviceRoute = require("./src/router/service-route");
const communityRoute = require("./src/router/community-route");
const taskRoute = require("./src/router/task-rote");
const jobOrderRoute = require("./src/router/job-order-route");

app.get("/api", (req, res) => {
  res.send("Welcome to my Node API!");
});

app.use("/api/auth", authRoute);
app.use("/api/service", serviceRoute);
app.use("/api/community", communityRoute);
app.use("/api/task", taskRoute);
app.use("/api/job-order", jobOrderRoute);
