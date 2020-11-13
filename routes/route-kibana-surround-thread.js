const { Router } = require("express");
const router = Router();
const { loggerServer } = require("../helper/logger");

module.exports = router;

router.get("/:threadName/:serviceName:/:fromTS/:toTS", (req, res) => {
  const { threadName, serviceName, fromTS, toTS } = req.params;

  loggerServer(`Kibana surround thread page enter: ${req.connection.remoteAddress} 
    for thread ${threadName} and service ${serviceName}`);
  //res.render('8441_Kibana_Search_logs');
});
