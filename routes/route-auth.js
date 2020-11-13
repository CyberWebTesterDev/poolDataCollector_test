const { Router } = require("express");
const router = Router();
const { loggerServer, addHours } = require("../helper/logger");
const { authDummy, authLDAP } = require("../auth/auth-util");

module.exports = router;

router.post("/", async (req, res) => {
  const ip = req.connection.remoteAddress;
  const { userName, password } = req.body;

  loggerServer(`Authentication request from: ${ip}`);
  loggerServer(`Session data: `);
  console.log(req.session);
  console.log(req.sessionID);
  loggerServer(`Request for user: ${userName}`);

  try {
    let result = await authLDAP(userName, password);

    if (result) {
      loggerServer(`Authentication success`);
      req.session.isAuthenticated = true;
      req.session.cookie.maxAge = 7200000;
      req.session.userName = userName;
      req.session.remoteIPAddress = ip;
      req.session.sessionStarted = new Date().toISOString();
      let pathStr = req.session.pathAccessUnauthenticated
        ? req.session.pathAccessUnauthenticated
        : "/null/null";

      console.log(`pathStr: ${pathStr}` + "\n");

      pathStr.split("/")[1] == "kibana"
        ? (pathStr = pathStr)
        : pathStr.split("/")[1] == "frontrequest"
        ? (pathStr = `/support/${pathStr.split("/")[3]}`)
        : (pathStr.split("/")[1] == "support" && pathStr.split("/").length == 3) ||
          pathStr.split("/")[1] == "kibana"
        ? (pathStr = pathStr)
        : (pathStr = null);
      console.log(`pathStr result redirect: ${pathStr}` + "\n");
      pathStr ? res.redirect(pathStr) : res.redirect("/index");
    } else {
      loggerServer(`Authentication credentials invalid`);
      req.session.isAuthenticated = false;
      req.session.userName = userName;
      req.session.remoteIPAddress = ip;
      req.session.faultDateTime = new Date().toISOString();
      req.session.failsCounter ? req.session.failsCounter++ : (req.session.failsCounter = 1);
      res.send(JSON.stringify({ responseCode: "01", description: "Invalid credentials" }));
    }
  } catch (e) {
    loggerServer(`Authentication exception`);
    console.log(e);
    req.session.isAuthenticated = false;
    req.session.userName = userName;
    req.session.remoteIPAddress = ip;
    req.session.errorMessage = e;
    req.session.faultDateTime = new Date().toISOString();
    req.session.failsCounter ? req.session.failsCounter++ : (req.session.failsCounter = 1);
    res.send(JSON.stringify({ responseCode: "02", description: "Possible error" }));
  }
});
