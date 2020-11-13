const dateTime = require("./datetime");
const { Pool } = require("pg");
const sql = require("./configs/sql");
const pcon = require("./configs/poolconfigs");
const poolCamunda = new Pool(pcon.configCamunda);
const poolSearch = new Pool(pcon.configSearchstore);
const poolApplication = new Pool(pcon.configApplication);
const poolCCapplication = new Pool(pcon.configCCapplication);
const poolAdministration = new Pool(pcon.configAdministration);
const poolStatusview = new Pool(pcon.configStatusview);
const poolMapplication = new Pool(pcon.configMapplication);
const poolAutoApplication = new Pool(pcon.configAutoApplication);
const poolMrealEstate = new Pool(pcon.configMrealestate);
const poolClientService = new Pool(pcon.configClientService);

const getStrResultset = arr => {
  return arr.map(el => {
    return JSON.stringify(el);
  });
};

const getJsonResultset = arr => {
  return arr.map(el => {
    return JSON.parse(el);
  });
};

const getAsyncData = async (input, route) => {
  const loggerRP = message => {
    dateTime.getCurrentDateTime();
    console.log(`Request Processor: ${message}` + "\n");
  };

  if (input) {
    let participantAdditional = [];
    let result = [];
    switch (route) {
      case "ERROR_1":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_CAMUNDA_VARIABLE_ERROR_MESSAGE.values[0] = input;
        result = await poolCamunda.query(sql.SQL_SELECT_CAMUNDA_VARIABLE_ERROR_MESSAGE);
        result = getStrResultset(result.rows);
        return result;
      case "ERROR_2":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_CAMUNDA_VARIABLE_ERROR_STACK_TRACE.values[0] = input;
        result = await poolCamunda.query(sql.SQL_SELECT_CAMUNDA_VARIABLE_ERROR_STACK_TRACE);
        result = getStrResultset(result.rows);
        return result;
      case "ERROR_3":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_CAMUNDA_VARIABLE_ERROR_BUSINESS.values[0] = input;
        result = await poolCamunda.query(sql.SQL_SELECT_CAMUNDA_VARIABLE_ERROR_BUSINESS);
        result = getStrResultset(result.rows);
        return result;
      case "ipoteka_real_estate":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_MAPPLICATION_REAL_ESTATE_ID.values[0] = input;
        result = await poolMapplication.query(sql.SQL_SELECT_MAPPLICATION_REAL_ESTATE_ID);
        result = getStrResultset(result.rows);
        return result;
      case "ipoteka_real_estate_2":
        sql.SQL_SELECT_MREALESTATE_REAL_ESTATE.values[0] = input;
        result = await poolMrealEstate.query(sql.SQL_SELECT_MREALESTATE_REAL_ESTATE);
        result = getStrResultset(result.rows);
        return result;
      case "evaluation_report":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_MREALESTATE_EVALUATION_REPORT.values[0] = input;
        result = await poolMrealEstate.query(sql.SQL_SELECT_MREALESTATE_EVALUATION_REPORT);
        result = getStrResultset(result.rows);
        return result;
      case "ipoteka_participant":
        loggerRP(`Processing the route ${route} for ${input}...`);
        participantAdditional = [];
        sql.SQL_SELECT_MAPPLICATION_PARTICIPANTS.values[0] = input;
        result = await poolMapplication.query(sql.SQL_SELECT_MAPPLICATION_PARTICIPANTS);
        result = result.rows;
        for (let i = 0; i < result.length; i++) {
          loggerRP(
            `Collecting participant data, index: ${i},  form_id: ${result[i].participant_form_id}`
          );
          sql.SQL_SELECT_CLIENT_FORM.values[0] = result[i].participant_form_id;
          participantAdditional = await poolClientService.query(sql.SQL_SELECT_CLIENT_FORM);
          participantAdditional = participantAdditional.rows;
          result[i] = { ...result[i], ...participantAdditional[0] };
        }
        result = getStrResultset(result);
        return result;
      case "tasks":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_CAMUNDA_ACTUAL_TASKS.values[0] = input;
        result = await poolCamunda.query(sql.SQL_SELECT_CAMUNDA_ACTUAL_TASKS);
        result = getStrResultset(result.rows);
        return result;
      case "potrebrefin_all":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_POTREB_REFIN_LIAB_ALL.values[0] = input;
        result = await poolApplication.query(sql.SQL_POTREB_REFIN_LIAB_ALL);
        result = getStrResultset(result.rows);
        return result;
      case "mapplication":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_MAPPLICATION_APPLICATION.values[0] = input;
        result = await poolMapplication.query(sql.SQL_SELECT_MAPPLICATION_APPLICATION);
        result = getStrResultset(result.rows);
        return result;
      case "application":
        sql.SQL_SELECT_APPLICATION_DATA.values[0] = input;
        result = await poolApplication.query(sql.SQL_SELECT_APPLICATION_DATA);
        result = getStrResultset(result.rows);
        return result;
      case "ccapplication":
        sql.SQL_SELECT_CCAPPLICATION_APPLICATION.values[0] = input;
        result = await poolCCapplication.query(sql.SQL_SELECT_CCAPPLICATION_APPLICATION);
        result = getStrResultset(result.rows);
        return result;
      case "auto_application":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_AUTOAPPLICATION_DATA.values[0] = input;
        result = await poolAutoApplication.query(sql.SQL_SELECT_AUTOAPPLICATION_DATA);
        result = getStrResultset(result.rows);
        return result;
      case "contract_card":
        sql.SQL_SELECT_CCAPPLICATION_CONTRACT_PARAMETERS.values[0] = input;
        result = await poolCCapplication.query(sql.SQL_SELECT_CCAPPLICATION_CONTRACT_PARAMETERS);
        result = getStrResultset(result.rows);
        return result;
      case "letter_of_credit":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_MAPPLICATION_DATA_LETTER_OF_CREDIT.values[0] = input;
        result = await poolMapplication.query(sql.SQL_SELECT_MAPPLICATION_DATA_LETTER_OF_CREDIT);
        result = getStrResultset(result.rows);
        return result;
      case "agreement_purchase":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_MAPPLICATION_AGGREEMENT_PURCHASE.values[0] = input;
        result = await poolMapplication.query(sql.SQL_SELECT_MAPPLICATION_AGGREEMENT_PURCHASE);
        result = getStrResultset(result.rows);
        return result;
      case "letter_of_credit_primary":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_MAPPLICATION_PRIMARY_DATA_LETTER_OF_CREDIT.values[0] = input;
        result = await poolMapplication.query(
          sql.SQL_SELECT_MAPPLICATION_PRIMARY_DATA_LETTER_OF_CREDIT
        );
        result = getStrResultset(result.rows);
        return result;
      case "transfer_order":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_MAPPLICATION_TRANSFER_ORDER.values[0] = input;
        result = await poolMapplication.query(sql.SQL_SELECT_MAPPLICATION_TRANSFER_ORDER);
        result = getStrResultset(result.rows);
        return result;
      case "legal_document":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_MAPPLICATION_LEGAL_DOCUMENT.values[0] = input;
        result = await poolMapplication.query(sql.SQL_SELECT_MAPPLICATION_LEGAL_DOCUMENT);
        result = getStrResultset(result.rows);
        return result;
      case "execution_log":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_SEARCHSTORESERVICE_BPM_EXECUTIONS.values[0] = input;
        result = await poolSearch.query(sql.SQL_SELECT_SEARCHSTORESERVICE_BPM_EXECUTIONS);
        result = getStrResultset(result.rows);
        return result;
      case "process_log":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_CAMUNDA_PROCESS_HISTORY.values[0] = input;
        result = await poolCamunda.query(sql.SQL_SELECT_CAMUNDA_PROCESS_HISTORY);
        result = getStrResultset(result.rows);
        return result;
      case "job_data":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_CAMUNDA_JOB_HISTORY.values[0] = input;
        result = await poolCamunda.query(sql.SQL_SELECT_CAMUNDA_JOB_HISTORY);
        result = getStrResultset(result.rows);
        return result;
      case "tasks_archive":
        loggerRP(`Processing the route ${route} for ${input}...`);
        sql.SQL_SELECT_CAMUNDA_ARCHIVE_TASKS.values[0] = input;
        result = await poolCamunda.query(sql.SQL_SELECT_CAMUNDA_ARCHIVE_TASKS);
        result = getStrResultset(result.rows);
        return result;
      case "auto_client":
        loggerRP(`Processing the route ${route} for ${input}...`);
        participantAdditional = [];
        sql.SQL_SELECT_PARTICIPANT_FORM_ID_APPLICATION_PARTICIPANTS.values[0] = input;
        result = await poolAutoApplication.query(
          sql.SQL_SELECT_PARTICIPANT_FORM_ID_APPLICATION_PARTICIPANTS
        );
        result = result.rows;
        sql.SQL_SELECT_CLIENTSERVICE_PARTICIPANT.values[0] = result[0].participant_form_id;
        participantAdditional = await poolClientService.query(
          sql.SQL_SELECT_CLIENTSERVICE_PARTICIPANT
        );
        participantAdditional = participantAdditional.rows;
        result[0] = { ...result[0], ...participantAdditional[0] };
        result = getStrResultset(result);
        return result;
      case "consumer_client":
        loggerRP(`Processing the route ${route} for ${input}...`);
        participantAdditional = [];
        sql.SQL_SELECT_PARTICIPANT_FORM_ID_APPLICATION_PARTICIPANTS.values[0] = input;
        result = await poolApplication.query(
          sql.SQL_SELECT_PARTICIPANT_FORM_ID_APPLICATION_PARTICIPANTS
        );
        result = result.rows;
        sql.SQL_SELECT_CLIENTSERVICE_PARTICIPANT.values[0] = result[0].participant_form_id;
        participantAdditional = await poolClientService.query(
          sql.SQL_SELECT_CLIENTSERVICE_PARTICIPANT
        );
        participantAdditional = participantAdditional.rows;
        result[0] = { ...result[0], ...participantAdditional[0] };
        result = getStrResultset(result);
        return result;
      case "card_client":
        loggerRP(`Processing the route ${route} for ${input}...`);
        participantAdditional = [];
        sql.SQL_SELECT_PARTICIPANT_FORM_ID_APPLICATION_PARTICIPANTS.values[0] = input;
        result = await poolCCapplication.query(
          sql.SQL_SELECT_PARTICIPANT_FORM_ID_APPLICATION_PARTICIPANTS
        );
        result = result.rows;
        sql.SQL_SELECT_CLIENTSERVICE_PARTICIPANT.values[0] = result[0].participant_form_id;
        participantAdditional = await poolClientService.query(
          sql.SQL_SELECT_CLIENTSERVICE_PARTICIPANT
        );
        participantAdditional = participantAdditional.rows;
        result[0] = { ...result[0], ...participantAdditional[0] };
        result = getStrResultset(result);
        return result;
      case "m_client":
        loggerRP(`Processing the route ${route} for ${input}...`);
        participantAdditional = [];
        sql.SQL_SELECT_PARTICIPANT_FORM_ID_MAPPLICATION_PARTICIPANTS.values[0] = input;
        result = await poolMapplication.query(
          sql.SQL_SELECT_PARTICIPANT_FORM_ID_MAPPLICATION_PARTICIPANTS
        );
        result = result.rows;
        sql.SQL_SELECT_CLIENTSERVICE_PARTICIPANT.values[0] = result[0].participant_form_id;
        participantAdditional = await poolClientService.query(
          sql.SQL_SELECT_CLIENTSERVICE_PARTICIPANT
        );
        participantAdditional = participantAdditional.rows;
        result[0] = { ...result[0], ...participantAdditional[0] };
        result = getStrResultset(result);
        return result;
      default:
        throw new Error(`RequestProcessor.getAsyncData: Не удалось распознать маршрут ${route}`);
    }
  } else {
    let voidArr = [];
    return voidArr;
  }
};

//success Promise
const externalQueryExecutorP = (input, p) => {
  dateTime.getCurrentDateTime();
  console.log(
    `Request Processor: External request has been received for ${input} with argument ${p}` + "\n"
  );

  sql.sqltest.values[0] = input;
  return new Promise((resolve, reject) => {
    if (p === "processid") {
      sql.SQL_SELECT_CAMUNDA_PROCESS_ID_2.values[0] = input;
      poolCamunda.query(sql.SQL_SELECT_CAMUNDA_PROCESS_ID_2, (err, res) => {
        if (err) {
          throw err;
        }

        let prArr = new Array();

        prArr = getStrResultset(res.rows);

        resolve(prArr);
      });
    }

    if (p === "tasks") {
      sql.SQL_SELECT_CAMUNDA_ACTUAL_TASKS.values[0] = input;
      poolCamunda.query(sql.SQL_SELECT_CAMUNDA_ACTUAL_TASKS, (err, res) => {
        if (err) {
          throw err;
        }
        let tskArr = new Array();
        tskArr = getStrResultset(res.rows);
        resolve(tskArr);
      });
    }
  });
  //return output
};

const getDataApp = (p1, p2) => {
  dateTime.getCurrentDateTime();
  console.log(`Request Processor: Received request for getDataApp for ${p2}` + "\n");

  var apparr = new Array();
  var appstatusarr = new Array();
  var eventarr = new Array();

  return new Promise((resolve, reject) => {
    if (p2 == "statusview") {
      sql.sqlstatus.values[0] = p1;
      poolStatusview.query(sql.sqlstatus, (err, res) => {
        if (err) {
          throw err;
        }

        appstatusarr = getStrResultset(res.rows);

        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Data has been collected for ${p2}` + "\n");
        resolve(appstatusarr);
      });
    }

    if (p2 == "search") {
      sql.SQL_SELECT_SEARCHSTORESERVICE_APPLICATIONSEARCH.values[0] = p1;

      poolSearch.query(sql.SQL_SELECT_SEARCHSTORESERVICE_APPLICATIONSEARCH, (err, res) => {
        if (err) {
          throw err;
        }

        apparr = getStrResultset(res.rows);

        resolve(apparr);
      });
    }

    if (p2 == "event") {
      sql.sqlevent.values[0] = p1;
      poolStatusview.query(sql.sqlevent, (err, res) => {
        if (err) {
          throw err;
        }

        eventarr = getStrResultset(res.rows);

        resolve(eventarr);
      });
    }
  }); //конец Promise
}; //конец getDataApp

//сбор параметров

const getParemetersData = (p1, p2) => {
  dateTime.getCurrentDateTime();
  console.log(
    `Request Processor: processing request for getParemetersData, starting to detect the route` +
      "\n"
  );

  sql.SQL_SELECT_APPLICATION_CREDIT_PARAMETERS.values[0] = p1;
  sql.SQL_SELECT_CCAPPLICATION_CREDIT_PARAMETERS.values[0] = p1;
  sql.SQL_SELECT_SEARCHSTORESERVICE_APPLICATIONSEARCH.values[0] = p1;
  let out = [];
  let out2 = [];
  let out3 = [];
  let outp = [];

  return new Promise((resolve, reject) => {
    if (p2 == "potreb") {
      console.log(`Request Processor: Route detected as ${p2}, starting to process...` + "\n");

      poolApplication.query(sql.SQL_SELECT_APPLICATION_CREDIT_PARAMETERS, (err, res) => {
        if (err) {
          throw err;
        }

        out = getStrResultset(res.rows);

        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Data has been collected for ${p2}` + "\n");
        resolve(out);
      });
      //resolve (out);   //первый success
    } //resolve (out); //конец ветвления потреба

    //автокредитование
    if (p2 == "auto") {
      sql.SQL_SELECT_AUTOAPPLICATION_CREDIT_PARAMETERS.values[0] = p1;
      dateTime.getCurrentDateTime();
      console.log(`Request Processor: Route detected as ${p2}, starting to process...` + "\n");

      poolAutoApplication.query(sql.SQL_SELECT_AUTOAPPLICATION_CREDIT_PARAMETERS, (err, res) => {
        if (err) {
          throw err;
        }

        out = getStrResultset(res.rows);

        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Data has been collected for ${p2}` + "\n");
        resolve(out);
      });
    }

    if (p2 == "autoakk") {
      sql.SQL_SELECT_AUTOAPPLICATION_ACCOUNTS.values[0] = p1;
      dateTime.getCurrentDateTime();
      console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}` + "\n");

      poolAutoApplication.query(sql.SQL_SELECT_AUTOAPPLICATION_ACCOUNTS, (err, res) => {
        if (err) {
          throw err;
        }

        out2 = getStrResultset(res.rows);

        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Data has been collected for ${p2}` + "\n");
        resolve(out2);
      });
    }

    if (p2 == "vehicle") {
      sql.SQL_SELECT_AUTOAPPLICATION_VEHICLE.values[0] = p1;
      dateTime.getCurrentDateTime();
      console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}` + "\n");

      poolAutoApplication.query(sql.SQL_SELECT_AUTOAPPLICATION_VEHICLE, (err, res) => {
        if (err) {
          throw err;
        }

        out3 = getStrResultset(res.rows);

        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Data has been collected for ${p2}` + "\n");
        resolve(out3);
      });
    }

    if (p2 == "potrebakk") {
      sql.SQL_SELECT_APPLICATION_ACCOUNTS.values[0] = p1;

      dateTime.getCurrentDateTime();
      console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}` + "\n");

      poolApplication.query(sql.SQL_SELECT_APPLICATION_ACCOUNTS, (err, res) => {
        if (err) {
          throw err;
        }

        out2 = getStrResultset(res.rows);

        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Data has been collected for ${p2}` + "\n");

        resolve(out2);
      });
    }

    if (p2 == "potrebrefin") {
      sql.SQL_SELECT_APPLICATION_REFINANCE_2.values[0] = p1;

      dateTime.getCurrentDateTime();
      console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}` + "\n");

      poolApplication.query(sql.SQL_SELECT_APPLICATION_REFINANCE_2, (err, res) => {
        if (err) {
          throw err;
        }

        out3 = getStrResultset(res.rows);

        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Data has been collected for ${p2}` + "\n");
        resolve(out3);
      });
    }

    if (p2 == "cc") {
      dateTime.getCurrentDateTime();
      console.log(
        "Request Processor: Checking if need to connect to application while processing getParemetersData...\n"
      );
      console.log(`Request Processor: Route detected as ${p2}, starting to process...` + "\n");

      poolCCapplication.query(sql.SQL_SELECT_CCAPPLICATION_CREDIT_PARAMETERS, (err, res) => {
        if (err) {
          throw err;
        }

        out = getStrResultset(res.rows);

        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Data collected for credit card` + "\n");
        resolve(out);
      });
      //второй success
    } //конец ветвления кредитной карты

    if (p2 == "ipoteka") {
      sql.SQL_SELECT_MAPPLICATION_CREDIT_PARAMETERS.values[0] = p1;
      dateTime.getCurrentDateTime();
      console.log(`Request Processor: Ipoteka exception` + "\n");
      console.log(`Request Processor: Route detected as ${p2}, starting to process...` + "\n");

      poolMapplication.query(sql.SQL_SELECT_MAPPLICATION_CREDIT_PARAMETERS, (err, res) => {
        if (err) {
          throw err;
        }

        out = getStrResultset(res.rows);

        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Data collected for ipoteka` + "\n");
        resolve(out);
      });
      //третий success
    } //конец ветвления ипотеки

    if (p2 == "ipoteka_akk") {
      sql.SQL_SELECT_MAPPLICATION_ACCOUNTS.values[0] = p1;

      dateTime.getCurrentDateTime();
      console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}` + "\n");

      poolMapplication.query(sql.SQL_SELECT_MAPPLICATION_ACCOUNTS, (err, res) => {
        if (err) {
          throw err;
        }

        out3 = getStrResultset(res.rows);

        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Data collected for ipoteka` + "\n");
        resolve(out3);
      });
    } //конец ветвления ipoteka_akk

    if (p2 == "kard_akk") {
      sql.SQL_SELECT_CCAPPLICATION_ACCOUNTS.values[0] = p1;

      dateTime.getCurrentDateTime();
      console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}` + "\n");

      poolCCapplication.query(sql.SQL_SELECT_CCAPPLICATION_ACCOUNTS, (err, res) => {
        if (err) {
          throw err;
        }

        out2 = getStrResultset(res.rows);

        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Data collected for Credit Card` + "\n");
        resolve(out2);
      });
    } //конец kard_akk

    if (p2 == "Ignore") {
      out3 = ["Ignore"];
      dateTime.getCurrentDateTime();
      console.log(`Request Processor: Starting to collect data for route ${p1} ${p2}` + "\n");
      resolve(out3);
    }
  }); //конец Promise
}; //конец getParemetersData

const getIntegrationsLog = p1 => {
  dateTime.getCurrentDateTime();
  console.log(
    `Request Processor: request from server for integration data has been received for ${p1}` + "\n"
  );

  sql.sqladmin.values[0] = p1;
  var intarr = [];
  return new Promise((resolve, reject) => {
    poolAdministration.query(sql.sqladmin, (err, res) => {
      if (err) {
        throw err;
      }

      intarr = getStrResultset(res.rows);

      dateTime.getCurrentDateTime();
      console.log(`Request Processor: Integration data has been collected` + "\n");
      resolve(intarr);
    });
  });
}; //конец

const getMonitoringData = p => {
  dateTime.getCurrentDateTime();
  console.log(`Request Processor: Received request for ${p} pool data for monitoring` + "\n");

  let montarr = [];
  let montarr2 = [];
  let montarr3 = [];
  let montarr4 = [];

  return new Promise((resolve, reject) => {
    if (p == "integration") {
      poolAdministration.query(sql.sqlmon, (err, res) => {
        if (err) {
          throw err;
        }

        montarr = getStrResultset(res.rows);

        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Monitoring data has been collected` + "\n");
        resolve(montarr);
      });
    }

    if (p == "CC_fails") {
      poolCamunda.query(sql.sqlmon2, (err, res) => {
        if (err) {
          throw err;
        }

        montarr2 = getStrResultset(res.rows);

        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Monitoring data has been collected` + "\n");
        resolve(montarr2);
      });
    }

    if (p == "topErrors") {
      poolCamunda.query(sql.sqlmon3, (err, res) => {
        if (err) {
          throw err;
        }

        montarr3 = getStrResultset(res.rows);
        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Monitoring data has been collected` + "\n");
        resolve(montarr3);
      });
    }

    if (p == "topErrorsDO") {
      poolCamunda.query(sql.sqlmon3_DO_2, (err, res) => {
        if (err) {
          throw err;
        }

        montarr3 = getStrResultset(res.rows);
        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Monitoring data has been collected` + "\n");
        resolve(montarr3);
      });
    }

    if (p == "topHangings") {
      poolCamunda.query(sql.sqlmon4, (err, res) => {
        if (err) {
          throw err;
        }
        montarr4 = getStrResultset(res.rows);
        dateTime.getCurrentDateTime();
        console.log(`Request Processor: Monitoring data has been collected` + "\n");
        resolve(montarr4);
      });
    }
  });
};

const connectionClose = () => {
  poolCamunda.end(() => {
    dateTime.getCurrentDateTime();
    console.log("poolCamunda has ended");
  });
  poolSearch.end(() => {
    dateTime.getCurrentDateTime();
    console.log("poolSearch has ended");
  });
  poolApplication.end(() => {
    dateTime.getCurrentDateTime();
    console.log("poolApplication has ended");
  });
  poolCCapplication.end(() => {
    dateTime.getCurrentDateTime();
    console.log("poolCCapplication has ended");
  });
  poolAdministration.end(() => {
    dateTime.getCurrentDateTime();
    console.log("poolAdministration has ended");
  });
  poolStatusview.end(() => {
    dateTime.getCurrentDateTime();
    console.log("poolStatusview has ended");
  });
  poolMapplication.end(() => {
    dateTime.getCurrentDateTime();
    console.log("poolMapplication has ended");
  });
  poolAutoApplication.end(() => {
    dateTime.getCurrentDateTime();
    console.log("poolAutoApplication has ended");
  });
  poolMrealEstate.end(() => {
    dateTime.getCurrentDateTime();
    console.log("poolMrealEstate has ended");
  });
  poolClientService.end(() => {
    dateTime.getCurrentDateTime();
    console.log("poolClientService has ended");
  });
};

exports.connectionClose = connectionClose;
exports.externalQueryExecutorP = externalQueryExecutorP;
exports.getDataApp = getDataApp;
exports.getParemetersData = getParemetersData;
exports.getIntegrationsLog = getIntegrationsLog;
exports.getMonitoringData = getMonitoringData;
exports.getJsonResultset = getJsonResultset;
exports.getStrResultset = getStrResultset;
exports.getAsyncData = getAsyncData;
//exports.clientIntegrationLog = clientIntegrationLog;
//exports.sqladmin = sqladmin;
//exports.sqlext = sqltest;
