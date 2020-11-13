const { Router } = require("express");
const router = Router();
const { loggerServer } = require("../helper/logger");

module.exports = router;

router.get("/", (req, res) => {
  loggerServer(`Login page enter: ${req.connection.remoteAddress}`);
  res.render("8441_Login_page_2");
});
