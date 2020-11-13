const { Router } = require("express");
const router = Router();
const { loggerServer } = require("../helper/logger");

module.exports = router;

router.get("/", (req, res) => {
  loggerServer(`Index page enter: ${req.connection.remoteAddress}`);
  res.render("index.ejs");
});
