const { Router } = require("express");
const router = Router();
const { loggerServer } = require("../helper/logger");
const { DataCollector } = require("../helper/dataCollector");

module.exports = router;

router.get("/:appnum", async (req, res) => {
  loggerServer(`Analyze page request: ${req.connection.remoteAddress}`);

  const { appnum } = req.params;

  if (appnum.length !== 10 || !appnum || isNaN(appnum)) {
    loggerServer(`Router Analyze: invalid application number`);
    res.send(`<h2>Некоррктный номер заявки !</h2>`);
  }

  res.render("8441_Analyze_Page", { appnum });
});
