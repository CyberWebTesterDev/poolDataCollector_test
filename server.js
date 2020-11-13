const express = require("express");
const session = require("express-session");
const dateTime = require("./datetime");
const rp = require("./RequestProcessor");
const app = express();
const port = 3000;
const devPort = 9850;
const { getJsonResultset } = require("./RequestProcessor");
const { MapperDict } = require("./mapper");
const { DataCollector } = require("./helper/dataCollector");
const routerStat = require("./routes/route-stat");
const routerIntegration = require("./routes/route-integration");
const routerLogin = require("./routes/route-login");
const routerAuth = require("./routes/route-auth");
const routerIndex = require("./routes/route-index");
const routerELK = require("./routes/route-elk-search");
const routerAnalyze = require("./routes/route-analyze");
const routerKibana = require("./routes/route-kibana");
const routerKibanaSurroundThread = require("./routes/route-kibana-surround-thread");
const localsMiddleware = require("./middleware/locals");
const authenticationChecker = require("./middleware/authentication-checker");

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

app.set("view engine", "ejs");
app.set("trust proxy", true);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "admin",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(localsMiddleware);
app.use(authenticationChecker);

app.use("/favicon.ico", express.static("images/favicon.ico"));
app.use("/public", express.static("public"));

//routes
app.use("/monitor/statistics", routerStat);
app.use("/monitor/integration", routerIntegration);
app.use("/login", routerLogin);
app.use("/authenticate", routerAuth);
app.use("/index", routerIndex);
app.use("/elksearch", routerELK);
app.use("/analyze/", routerAnalyze);
app.use("/kibana", routerKibana);
app.use("/kibana/surround-thread/", routerKibanaSurroundThread);

app.get("/", (req, res) => {
  dateTime.getCurrentDateTime();
  console.log(`: Request event on start page` + "\n");
  res.send("Start page");
});

app.get("/admin/closeconnect", (req, res) => {
  dateTime.getCurrentDateTime();
  console.log(`Server: Request to close conntction` + "\n");
  rp.connectionClose();
  res.send("Connection to DB was closed");
});

app.get("/stop", (req, res) => {
  process.exit(0);
});

//МОНИТОРИНГ

app.get("/monitor/cards", (req, res) => {
  const ip1 = req.connection.remoteAddress;
  const ip2 = req.header("x-forwarded-for");

  dateTime.getCurrentDateTime();
  console.log(`Server: Request monitor cards has been received:` + "\n");
  console.log(req.headers);
  dateTime.getCurrentDateTime();
  console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}` + "\n");

  rp.getMonitoringData("CC_fails")
    .then((montarr2) => {
      //1st

      let montl2 = getJsonResultset(montarr2);

      montl2.forEach((el, i, array) => {
        array[i].start_time_ = new Date(array[i].start_time_);
        array[i].start_time_.addHours(3);
        array[i].start_time_ = array[i].start_time_
          .toISOString()
          .replace("T", " ")
          .replace("Z", "");
      });
      res.render("Monitor_dashboard", {
        data2: montl2,
        data: [],
        data3: [],
        data4: [],
      });
      dateTime.getCurrentDateTime();
      console.log(`Server: Data collection is done:` + "\n");
      dateTime.getCurrentDateTime();
      console.log(`Server: Listening:` + "\n");
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/monitor/errors", (req, res) => {
  const ip1 = req.connection.remoteAddress;
  const ip2 = req.header("x-forwarded-for");
  dateTime.getCurrentDateTime();
  console.log(`Server: Request monitor errors has been received:` + "\n");
  console.log(req.headers);
  dateTime.getCurrentDateTime();
  console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}` + "\n");

  rp.getMonitoringData("topErrors")
    .then((montarr3) => {
      let montl3 = getJsonResultset(montarr3);

      montl3.forEach((el, i, array) => {
        array[i].start_time_ = new Date(array[i].start_time_);
        array[i].start_time_.addHours(3);
        array[i].start_time_ = array[i].start_time_
          .toISOString()
          .replace("T", " ")
          .replace("Z", "");
      });

      res.render("Monitor_dashboard", {
        data3: montl3,
        data2: [],
        data: [],
        data4: [],
      });

      dateTime.getCurrentDateTime();
      console.log(`Server: Data collection is done:` + "\n");
      dateTime.getCurrentDateTime();
      console.log(`Server: Listening:` + "\n");
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/monitor/errors/do", (req, res) => {
  const ip1 = req.connection.remoteAddress;
  const ip2 = req.header("x-forwarded-for");

  dateTime.getCurrentDateTime();
  console.log(
    `Server: Request monitor errors for DO has been received:` + "\n"
  );
  console.log(req.headers);
  dateTime.getCurrentDateTime();
  console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}` + "\n");

  rp.getMonitoringData("topErrorsDO")
    .then((montarr3) => {
      let montl3 = getJsonResultset(montarr3);

      montl3.forEach((el, i, array) => {
        array[i].start_time_ = new Date(array[i].start_time_);
        array[i].start_time_.addHours(3);
        array[i].start_time_ = array[i].start_time_
          .toISOString()
          .replace("T", " ")
          .replace("Z", "");
      });

      res.render("Monitor_dashboard", {
        data3: montl3,
        data2: [],
        data: [],
        data4: [],
      });

      dateTime.getCurrentDateTime();
      console.log(`Server: Data collection is done:` + "\n");
      dateTime.getCurrentDateTime();
      console.log(`Server: Listening:` + "\n");
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/monitor/hang", (req, res) => {
  const ip1 = req.connection.remoteAddress;
  const ip2 = req.header("x-forwarded-for");

  dateTime.getCurrentDateTime();
  console.log(`Server: Request monitor hang has been received:` + "\n");
  console.log(req.headers);
  dateTime.getCurrentDateTime();
  console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}` + "\n");

  rp.getMonitoringData("topHangings")
    .then((montarr4) => {
      let montl4 = getJsonResultset(montarr4);

      montl4.forEach((el, i, array) => {
        array[i].start_time_ = new Date(array[i].start_time_);
        array[i].start_time_.addHours(3);
        array[i].start_time_ = array[i].start_time_
          .toISOString()
          .replace("T", " ")
          .replace("Z", "");
      });

      res.render("Monitor_dashboard", {
        data3: [],
        data2: [],
        data: [],
        data4: montl4,
      });

      dateTime.getCurrentDateTime();
      console.log(`Server: Data collection is done:` + "\n");
      dateTime.getCurrentDateTime();
      console.log(`Server: Listening:` + "\n");
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/tocamunda/:appnum", (req, res) => {
  const { appnum } = req.params;

  const ip1 = req.connection.remoteAddress;
  const ip2 = req.header("x-forwarded-for");

  dateTime.getCurrentDateTime();
  console.log(`Server: Request for Camunda link has been received:` + "\n");
  console.log(req.headers);
  dateTime.getCurrentDateTime();
  console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}` + "\n");

  const getProcessId = async (num) => {
    try {
      let pid = await rp.externalQueryExecutorP(num, "processid");
      return pid;
    } catch (e) {
      throw e;
    }
  };

  if (!(appnum.length !== 10 || !appnum || isNaN(appnum))) {
    getProcessId(appnum)
      .then((process) => {
        if (process.length > 0 && process.length < 2) {
          let data = getJsonResultset(process);

          const pid = data[data.length - 1].proc_inst_id_;

          const _uriCamundaBase = `https://test.app.rcl.int.***.ru/testpath/app/test/default/#/process-instance/`;

          res.send(
            `<a href="${_uriCamundaBase}${pid}" target="_blank"><font size="24px">В камунду Cockpit</font></a>`
          );
          dateTime.getCurrentDateTime();
          console.log(
            `Server: Requset for Camunda link has been processed. Result: SUCCESS` +
              "\n"
          );
        } else if (process.length > 1) {
          let linkarr = [];
          let data = getJsonResultset(process);
          data.map((p) => {
            return linkarr.push(p.proc_inst_id_);
          });
          res.send(
            `<h2>По заявке ${appnum} задублирован процесс. Всего процессов: ${linkarr.length}. Необходимо удалить один из процессов.</h2>`
          );
          dateTime.getCurrentDateTime();
          console.log(
            `Server: Requset for Camunda link has been processed. Result: PROCESS > 1` +
              "\n"
          );
        } else {
          res.send(`<h2>По заявке ${appnum} нет действующих процессов!`);
          dateTime.getCurrentDateTime();
          console.log(
            `Server: Requset for Camunda link has been processed. Result: NO PROCESS` +
              "\n"
          );
        }
      })
      .catch((e) => {
        throw e;
      });
  } else {
    res.send(
      `<h2>Ошибка в номере заявки ${appnum}! Введите корректный номер!</h2>`
    );
  }
});

app.get("/getdictvalue/:uid", (req, res) => {
  const { uid } = req.params;

  const ip1 = req.connection.remoteAddress;
  const ip2 = req.header("x-forwarded-for");

  dateTime.getCurrentDateTime();
  console.log(`Server: Request for Dictionary has been received:` + "\n");
  console.log(req.headers);
  dateTime.getCurrentDateTime();
  console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}` + "\n");

  if (uid) {
    const md = new MapperDict();
    let record = [];
    dateTime.getCurrentDateTime();
    console.log(`Server: Starting to detect the value from dictionary` + "\n");
    record = md.detectDictionaryRecord(uid);
    dateTime.getCurrentDateTime();
    console.log("Server: Record has been received:", record);

    if (record[0] !== -1) {
      res.send(
        `<h2>Значение ${uid}: <font color="green">${record[2]}</font></h2>`
      );
    } else {
      res.send(
        `<h2>Значение ${uid} не было найдено в локальном справочнике</h2>`
      );
    }
  } else {
    res.send(`<h2>Невалидное значение UID</h2>`);
  }
});

app.get("/support/:appnum", (req, res) => {
  //const {appnum} = req.params;

  const dc = new DataCollector();
  dc.loggerServer(
    `Handling the entry request for support ${req.connection.remoteAddress}`
  );

  req.session.remoteIPAddress = req.connection.remoteAddress;
  req.session.mainSupportEntryCounter
    ? req.session.mainSupportEntryCounter++
    : (req.session.mainSupportEntryCounter = 1);

  console.log(req.session);
  console.log(req.sessionID);
  console.log("\n");

  res.render("8441_Support_dummy_script2");
  dc.loggerServer("Entry template has been rendered");
});

app.get("/frontrequest/aggregatedatafromdb/:appnum", (req, res) => {
  const { appnum } = req.params;

  const ip1 = req.connection.remoteAddress;
  const ip2 = req.header("x-forwarded-for") || req.connection.remoteAddress;

  const dc = new DataCollector();
  dc.loggerServer(
    `Received support request for applicaion number ${appnum} from ${ip1}, ${ip2}`
  );
  dc.loggerServer(`Headers: ${JSON.stringify(req.headers)}`);

  if (appnum.length !== 10 || !appnum || isNaN(appnum)) {
    console.log(req.headers);
    dc.loggerServer(`Bad application number ${appnum}`);
    res.send(
      `<h2>Ошибка в номере заявки ${appnum}! Введите корректный номер!</h2>`
    );
  } else {
    const main = async (applicationNum) => {
      try {
        const resultSet = await dc.collectData(applicationNum);
        return resultSet;
      } catch (e) {
        console.error(e);
        res.send(
          `<h1>При выполнении запроса произошла ошибка: <br></h1><h2><font color="red">${e}</font></h2>`
        );
      }
    };

    main(appnum).then((data) => {
      data = JSON.parse(data);
      dc.loggerServer(
        `Received data from dataCollector for application ${appnum}`
      );

      const { credit_type_name: ctp } = data.searchData[0];

      let links = [];

      switch (ctp) {
        case "Ипотечное кредитование":
          links.push(
            dc.makeErrorProcessingLink(appnum, ctp),
            dc.makeViewScanLink(appnum, ctp),
            dc.makeLink(appnum, "files_list"),
            dc.makeLink(appnum, "ipoteka_lien"),
            dc.makeLink(appnum, "ipoteka_history"),
            dc.makeLink(appnum, "ipoteka_info_mode"),
            dc.makeLink(appnum, "ipoteka_view_mode"),
            dc.makeLink(appnum, "ipoteka_final_view_mode")
          );
          break;
        case "Потребительское кредитование":
          links.push(
            dc.makeErrorProcessingLink(appnum, ctp),
            dc.makeViewScanLink(appnum, ctp),
            dc.makeLink(appnum, "files_list"),
            dc.makeLink(appnum, "potreb_redir")
          );
          break;
        case "Кредитование с использованием банковских карт":
          links.push(
            dc.makeErrorProcessingLink(appnum, ctp),
            dc.makeViewScanLink(appnum, ctp),
            dc.makeLink(appnum, "files_list"),
            dc.makeLink(appnum, "cc_redir")
          );
          break;
        case "Автокредитование":
          links.push(
            dc.makeErrorProcessingLink(appnum, ctp),
            dc.makeViewScanLink(appnum, ctp),
            dc.makeLink(appnum, "files_list"),
            dc.makeLink(appnum, "auto_redir")
          );
          break;
        default:
          break;
      }

      if (ctp === "Ипотечное кредитование") {
        if (data.tasksData.length !== 0) {
          if (data.tasksData[0].Error) {
            dc.loggerServer(
              `Application has error text attached: ${data.tasksData[0].Error}`
            );
          }
        }

        const renderMappData = {
          appnum: appnum,
          processData: data.processData,
          tasksData: data.tasksData,
          tasksArchData: data.tasksArchData,
          executionsLogData: data.executionsLogData,
          processLogData: data.processLogData,
          jobData: data.jobData,
          mapplicationData: data.mapplicationData,
          parametersData: data.parametersData,
          mortgageParticipantsData: data.mortgageParticipantsData,
          mortgageAccountsData: data.mortgageAccountsData,
          mortgageRealEstateData: data.mortgageRealEstateData,
          mortgageRealEstateData2: data.mortgageRealEstateData2,
          letterOfCreditData: data.letterOfCreditData,
          transferOrderData: data.transferOrderData,
          legalDocumentData: data.legalDocumentData,
          integrationLogData: data.integrationLogData,
          statusViewData: data.statusViewData,
          eventData: data.eventData,
          searchData: data.searchData,
          linkData: links,
        };

        res.render("Support_mortgage", renderMappData);
      } else if (ctp === "Потребительское кредитование") {
        if (data.tasksData.length !== 0) {
          if (data.tasksData[0].Error) {
            dc.loggerServer(
              `Application has error text attached: ${data.tasksData[0].Error}`
            );
          }
        }

        const renderAppData = {
          appnum: appnum,
          processData: data.processData,
          tasksData: data.tasksData,
          tasksArchData: data.tasksArchData,
          executionsLogData: data.executionsLogData,
          processLogData: data.processLogData,
          jobData: data.jobData,
          applicationData: data.applicationData,
          parametersData: data.parametersData,
          consumerAccountsData: data.consumerAccountsData,
          consumerRefinData: data.consumerRefinData,
          consumerRefinAllData: data.consumerRefinAllData,
          integrationLogData: data.integrationLogData,
          statusViewData: data.statusViewData,
          eventData: data.eventData,
          searchData: data.searchData,
          linkData: links,
        };

        res.render("Support2_potreb", renderAppData);
      } else if (ctp === "Кредитование с использованием банковских карт") {
        if (data.tasksData.length !== 0) {
          if (data.tasksData[0].Error) {
            dc.loggerServer(
              `Application has error text attached: ${data.tasksData[0].Error}`
            );
          }
        }

        const renderCardAppData = {
          appnum: appnum,
          processData: data.processData,
          tasksData: data.tasksData,
          tasksArchData: data.tasksArchData,
          executionsLogData: data.executionsLogData,
          processLogData: data.processLogData,
          jobData: data.jobData,
          ccapplicationData: data.ccapplicationData,
          parametersData: data.parametersData,
          cardAccountsData: data.cardAccountsData,
          contractCardData: data.contractCardData,
          integrationLogData: data.integrationLogData,
          statusViewData: data.statusViewData,
          eventData: data.eventData,
          searchData: data.searchData,
          linkData: links,
        };

        res.render("Support2_card", renderCardAppData);
      } else if (ctp === "Автокредитование") {
        if (data.tasksData.length !== 0) {
          if (data.tasksData[0].Error) {
            dc.loggerServer(
              `Application has error text attached: ${data.tasksData[0].Error}`
            );
          }
        }

        const renderAutoAppData = {
          appnum: appnum,
          processData: data.processData,
          tasksData: data.tasksData,
          tasksArchData: data.tasksArchData,
          executionsLogData: data.executionsLogData,
          processLogData: data.processLogData,
          jobData: data.jobData,
          autoApplicationData: data.autoApplicationData,
          parametersData: data.parametersData,
          autoAccountsData: data.autoAccountsData,
          autoVehicleData: data.autoVehicleData,
          integrationLogData: data.integrationLogData,
          statusViewData: data.statusViewData,
          eventData: data.eventData,
          searchData: data.searchData,
          linkData: links,
        };

        res.render("Support2_auto", renderAutoAppData);

        //res.send(`<h1>Страница по заявкам на автокредиты в разработке...</h1>`);
      }

      // res.send(data);
      dc.loggerServer(
        `Data for application ${appnum} has been successfully processed for ${ip1}`
      );
      dc.loggerServer("Listening...");
    });
  }
});

app.get("/frontrequest/aggregatedatafromdblight/:appnum", (req, res) => {
  const getSubString = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

  const generateUniqueId = () =>
    getSubString() + getSubString() + "-" + getSubString();

  const requestId = generateUniqueId();

  const { appnum } = req.params;

  const ip1 = req.connection.remoteAddress;
  const ip2 = req.header("x-forwarded-for") || req.connection.remoteAddress;

  req.session.remoteIPAddress = ip1;
  req.session.dbDataCounter
    ? req.session.dbDataCounter++
    : (req.session.dbDataCounter = 1);

  console.log(req.session);
  console.log(req.sessionID);
  console.log("\n");

  const dc = new DataCollector();
  dc.loggerServer(
    `Request id: ${requestId} Received light support request for applicaion number ${appnum} from ${ip1}, ${ip2}`
  );
  dc.loggerServer(`Headers: ${JSON.stringify(req.headers)}`);

  if (appnum.length !== 10 || !appnum || isNaN(appnum)) {
    console.log(req.headers);
    dc.loggerServer(`${requestId} Bad application number ${appnum}`);
    res.send(
      `<h2>Ошибка в номере заявки ${appnum}! Введите корректный номер!</h2>`
    );
  } else {
    const main = async (applicationNum) => {
      try {
        const resultSet = await dc.collectDataLight(applicationNum);
        return resultSet;
      } catch (e) {
        console.error(e);
        res.send(
          `<h1>При выполнении запроса произошла ошибка: <br></h1><h2><font color="red">${e}</font></h2>`
        );
      }
    };

    main(appnum).then((data) => {
      data = JSON.parse(data);

      dc.loggerServer(
        `${requestId} Received data from dataCollector for application ${appnum}`
      );

      const { credit_type_name: ctp } = data.searchData[0];

      let links = [];

      switch (ctp) {
        case "Потребительское кредитование":
          links.push(
            dc.makeErrorProcessingLink(appnum, ctp),
            dc.makeViewScanLink(appnum, ctp),
            dc.makeLink(appnum, "files_list"),
            dc.makeLink(appnum, "potreb_redir")
          );
          break;
        case "Ипотечное кредитование":
          links.push(
            dc.makeErrorProcessingLink(appnum, ctp),
            dc.makeViewScanLink(appnum, ctp),
            dc.makeLink(appnum, "files_list"),
            dc.makeLink(appnum, "ipoteka_lien"),
            dc.makeLink(appnum, "ipoteka_history"),
            dc.makeLink(appnum, "ipoteka_info_mode"),
            dc.makeLink(appnum, "ipoteka_view_mode"),
            dc.makeLink(appnum, "ipoteka_final_view_mode")
          );
          break;
        case "Кредитование с использованием банковских карт":
          links.push(
            dc.makeErrorProcessingLink(appnum, ctp),
            dc.makeViewScanLink(appnum, ctp),
            dc.makeLink(appnum, "files_list"),
            dc.makeLink(appnum, "cc_redir")
          );
          break;
        case "Автокредитование":
          links.push(
            dc.makeErrorProcessingLink(appnum, ctp),
            dc.makeViewScanLink(appnum, ctp),
            dc.makeLink(appnum, "files_list"),
            dc.makeLink(appnum, "auto_redir")
          );
          break;
        default:
          break;
      }

      if (ctp === "Потребительское кредитование") {
        const renderAppData = {
          appnum: appnum,
          applicationData: data.applicationData,
          parametersData: data.parametersData,
          consumerAccountsData: data.consumerAccountsData,
          consumerRefinData: data.consumerRefinData,
          consumerRefinAllData: data.consumerRefinAllData,
          integrationLogData: data.integrationLogData,
          statusViewData: data.statusViewData,
          eventData: data.eventData,
          searchData: data.searchData,
          linkData: links,
          additionalSupportData: data.additionalSupportData,
          paramsForSearchLogs: data.paramsForSearchLogs,
          paramsOksDataSearch: data.paramsOksDataSearch,
        };

        res.render("8441_Support2_potreb", renderAppData);

        // res.send(data);
        dc.loggerServer(
          `${requestId} Data for application ${appnum} has been successfully processed for ${ip1}`
        );
        dc.loggerServer("Listening...");
      } else if (ctp === "Ипотечное кредитование") {
        const renderMappData = {
          appnum: appnum,
          mapplicationData: data.mapplicationData,
          parametersData: data.parametersData,
          mortgageParticipantsData: data.mortgageParticipantsData,
          mortgageAccountsData: data.mortgageAccountsData,
          mortgageRealEstateData: data.mortgageRealEstateData,
          mortgageRealEstateData2: data.mortgageRealEstateData2,
          letterOfCreditData: data.letterOfCreditData,
          transferOrderData: data.transferOrderData,
          legalDocumentData: data.legalDocumentData,
          evaluationReportData: data.evaluationReportData,
          agreementPurchaseData: data.agreementPurchaseData,
          integrationLogData: data.integrationLogData,
          statusViewData: data.statusViewData,
          eventData: data.eventData,
          searchData: data.searchData,
          linkData: links,
          elkHits: data.elkHits,
          paramsForSearchLogs: data.paramsForSearchLogs,
        };

        res.render("8441_Support_mortgage", renderMappData);
        dc.loggerServer(
          `${requestId} Main data for application ${appnum} has been successfully processed for ${ip1}`
        );
      } else if (ctp === "Кредитование с использованием банковских карт") {
        const renderCardAppData = {
          appnum: appnum,
          ccapplicationData: data.ccapplicationData,
          parametersData: data.parametersData,
          cardAccountsData: data.cardAccountsData,
          contractCardData: data.contractCardData,
          integrationLogData: data.integrationLogData,
          statusViewData: data.statusViewData,
          eventData: data.eventData,
          searchData: data.searchData,
          linkData: links,
          paramsForSearchLogs: data.paramsForSearchLogs,
          paramsOksDataSearch: data.paramsOksDataSearch,
        };

        res.render("8441_Support2_card", renderCardAppData);
        dc.loggerServer(
          `${requestId} Main data for application ${appnum} has been successfully processed for ${ip1}`
        );
      } else if (ctp === "Автокредитование") {
        const renderAutoAppData = {
          appnum: appnum,
          autoApplicationData: data.autoApplicationData,
          parametersData: data.parametersData,
          autoAccountsData: data.autoAccountsData,
          autoVehicleData: data.autoVehicleData,
          integrationLogData: data.integrationLogData,
          statusViewData: data.statusViewData,
          eventData: data.eventData,
          searchData: data.searchData,
          linkData: links,
          paramsForSearchLogs: data.paramsForSearchLogs,
        };

        res.render("8441_Support2_auto", renderAutoAppData);
        dc.loggerServer(
          `${requestId} Main data for application ${appnum} has been successfully processed for ${ip1}`
        );

        //res.send(`<h1>Страница по заявкам на автокредиты в разработке...</h1>`);
      }
    });
  }
});

app.get("/frontrequest/bpmdata/:appnum/:status", (req, res) => {
  const { appnum, status } = req.params;

  const ip1 = req.connection.remoteAddress;

  req.session.remoteIPAddress = ip1;
  req.session.bpmRequestCounter
    ? req.session.bpmRequestCounter++
    : (req.session.bpmRequestCounter = 1);

  console.log(req.session);
  console.log(req.sessionID);
  console.log("\n");

  const dc = new DataCollector();
  dc.loggerServer(
    `Received bpmdata request for applicaion number ${appnum} with status ${status} from ${ip1}`
  );
  dc.loggerServer(`Headers: ${JSON.stringify(req.headers)}`);

  const main = async (applicationNum) => {
    try {
      const resultSet = await dc.getBPMprocessData(applicationNum);
      return resultSet;
    } catch (e) {
      console.error(e);
      res.send(
        `<h1>При выполнении запроса произошла ошибка: <br></h1><h2><font color="red">${e}</font></h2>`
      );
    }
  };

  main(appnum).then((data) => {
    data = JSON.parse(data);

    dc.loggerServer(
      `Received main BPM data from dataCollector for application ${appnum}`
    );

    if (data.errors.length !== 0) {
      dc.loggerServer(
        `Main BPM data has error text attached: ${data.errors[0]}`
      );
    }

    const renderAppData = {
      appnum: appnum,
      status: status,
      processData: data.processData,
      tasksData: data.tasksData,
      tasksArchData: data.tasksArchData,
      executionsLogData: data.executionsLogData,
      processLogData: data.processLogData,
      jobData: data.jobData,
      errors: data.errors,
    };

    res.render("8441_Process_Data", renderAppData);

    // res.send(data);
    dc.loggerServer(
      `Data for application ${appnum} has been successfully processed for ${ip1}`
    );
    dc.loggerServer("Listening...");
  });
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Error", err);
  }

  console.log(`server is listening on ${port}`);
});
