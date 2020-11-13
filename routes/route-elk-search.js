const { Router } = require("express");
const router = Router();
const { loggerServer } = require("../helper/logger");
const {
  elkSearchLogsAuthNeeded,
  elkSearchLogsAuthNeededOpt
} = require("../helper/elk-log-collector");
const { kbnCookie } = require("../event-emitter/EventEmitter");

module.exports = router;

router.post("/", async (req, res) => {
  if (!req.body.isOpt) {
    req.session.elkRequestCounter
      ? req.session.elkRequestCounter++
      : (req.session.elkRequestCounter = 1);

    loggerServer(`ELK search: ${req.connection.remoteAddress}`);
    loggerServer(`isOpt request: ${req.body.isOpt}`);
    loggerServer(`isAdditional request: ${req.body.isAdditional}`);

    if (!req.body) {
      throw new Error(`ELK Search Router: params is invalid`);
    }
    let parameters = [];
    let fieldNames = [];
    let fieldValues = [];
    const { operators } = req.body;

    for (let key in req.body) {
      if (key == "fieldNames") {
        fieldNames = req.body[key];
      }
      if (key == "fieldValues") {
        fieldValues = req.body[key];
      }
      if (key != "fieldNames" && key != "fieldValues" && key != "operators" && key != "isOpt") {
        parameters.push(req.body[key]);
      }
    }

    loggerServer(`ELK search: parameters: `);
    console.log(parameters);
    loggerServer(`ELK search: operators: `);
    console.log(operators);

    try {
      const elkHits = await elkSearchLogsAuthNeeded(parameters, fieldNames, fieldValues, operators);
      console.log(`Router ELK search: received response.`);
      res.render("partitions/elk-logs-table", { elkHits });
    } catch (e) {
      res.status(400).send(`Bad request`);
      //res.send(JSON.stringify({error: e}));
    }
  } else {
    loggerServer(`ELK search: ${req.connection.remoteAddress}`);
    loggerServer(`isOpt request: ${req.body.isOpt}`);
    loggerServer(`isAdditional request: ${req.body.isAdditional}`);

    try {
      const elkHits = await elkSearchLogsAuthNeededOpt(req.body);
      console.log(`Router ELK search: received response.`);
      if (req.body.isAdditional) {
        res.send(JSON.stringify(elkHits));
      } else {
        res.render("partitions/elk-logs-table", { elkHits });
      }
    } catch (e) {
      res.status(400).send(`Bad request`);
      //res.send(JSON.stringify({error: e}));
    }
  }
});
