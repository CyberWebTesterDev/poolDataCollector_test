const { Router } = require("express");
const router = Router();
const dateTime = require("../datetime");
const rp = require("../RequestProcessor");
const { getJsonResultset } = require("../RequestProcessor");

module.exports = router;

router.get("/", (req, res) => {
  const ip1 = req.connection.remoteAddress;
  const ip2 = req.header("x-forwarded-for");
  dateTime.getCurrentDateTime();
  console.log(`Server: Request monitor integration has been received:` + "\n");
  console.log(req.headers);
  dateTime.getCurrentDateTime();
  console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}` + "\n");

  rp.getMonitoringData("integration")
    .then(montarr => {
      let montl = [];

      montl = getJsonResultset(montarr);

      montl.forEach(el => {
        el.interaction_ts = new Date(el.interaction_ts);
        el.interaction_ts.addHours(3);
        el.interaction_ts = el.interaction_ts
          .toISOString()
          .replace("T", " ")
          .replace("Z", "");
      });

      res.render("Monitor_dashboard", { data: montl, data2: [], data3: [], data4: [] });
      dateTime.getCurrentDateTime();
      console.log(`Server: Data collection is done:` + "\n");
      dateTime.getCurrentDateTime();
      console.log(`Server: Listening...` + "\n");
    })
    .catch(err => {
      throw err;
    });
});
