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

Date.prototype.addHours = function(h) {
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
    saveUninitialized: false
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
    .then(montarr2 => {
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
      res.render("Monitor_dashboard", { data2: montl2, data: [], data3: [], data4: [] });
      dateTime.getCurrentDateTime();
      console.log(`Server: Data collection is done:` + "\n");
      dateTime.getCurrentDateTime();
      console.log(`Server: Listening:` + "\n");
    })
    .catch(err => {
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
    .then(montarr3 => {
      let montl3 = getJsonResultset(montarr3);

      montl3.forEach((el, i, array) => {
        array[i].start_time_ = new Date(array[i].start_time_);
        array[i].start_time_.addHours(3);
        array[i].start_time_ = array[i].start_time_
          .toISOString()
          .replace("T", " ")
          .replace("Z", "");
      });

      res.render("Monitor_dashboard", { data3: montl3, data2: [], data: [], data4: [] });

      dateTime.getCurrentDateTime();
      console.log(`Server: Data collection is done:` + "\n");
      dateTime.getCurrentDateTime();
      console.log(`Server: Listening:` + "\n");
    })
    .catch(err => {
      throw err;
    });
});

app.get("/monitor/errors/do", (req, res) => {
  const ip1 = req.connection.remoteAddress;
  const ip2 = req.header("x-forwarded-for");

  dateTime.getCurrentDateTime();
  console.log(`Server: Request monitor errors for DO has been received:` + "\n");
  console.log(req.headers);
  dateTime.getCurrentDateTime();
  console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}` + "\n");

  rp.getMonitoringData("topErrorsDO")
    .then(montarr3 => {
      let montl3 = getJsonResultset(montarr3);

      montl3.forEach((el, i, array) => {
        array[i].start_time_ = new Date(array[i].start_time_);
        array[i].start_time_.addHours(3);
        array[i].start_time_ = array[i].start_time_
          .toISOString()
          .replace("T", " ")
          .replace("Z", "");
      });

      res.render("Monitor_dashboard", { data3: montl3, data2: [], data: [], data4: [] });

      dateTime.getCurrentDateTime();
      console.log(`Server: Data collection is done:` + "\n");
      dateTime.getCurrentDateTime();
      console.log(`Server: Listening:` + "\n");
    })
    .catch(err => {
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
    .then(montarr4 => {
      let montl4 = getJsonResultset(montarr4);

      montl4.forEach((el, i, array) => {
        array[i].start_time_ = new Date(array[i].start_time_);
        array[i].start_time_.addHours(3);
        array[i].start_time_ = array[i].start_time_
          .toISOString()
          .replace("T", " ")
          .replace("Z", "");
      });

      res.render("Monitor_dashboard", { data3: [], data2: [], data: [], data4: montl4 });

      dateTime.getCurrentDateTime();
      console.log(`Server: Data collection is done:` + "\n");
      dateTime.getCurrentDateTime();
      console.log(`Server: Listening:` + "\n");
    })
    .catch(err => {
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

  const getProcessId = async num => {
    try {
      let pid = await rp.externalQueryExecutorP(num, "processid");
      return pid;
    } catch (e) {
      throw e;
    }
  };

  if (!(appnum.length !== 10 || !appnum || isNaN(appnum))) {
    getProcessId(appnum)
      .then(process => {
        if (process.length > 0 && process.length < 2) {
          let data = getJsonResultset(process);

          const pid = data[data.length - 1].proc_inst_id_;

          const _uriCamundaBase = `https://test.app.rcl.int.***.ru/testpath/app/test/default/#/process-instance/`;

          res.send(
            `<a href="${_uriCamundaBase}${pid}" target="_blank"><font size="24px">В камунду Cockpit</font></a>`
          );
          dateTime.getCurrentDateTime();
          console.log(
            `Server: Requset for Camunda link has been processed. Result: SUCCESS` + "\n"
          );
        } else if (process.length > 1) {
          let linkarr = [];
          let data = getJsonResultset(process);
          data.map(p => {
            return linkarr.push(p.proc_inst_id_);
          });
          res.send(
            `<h2>По заявке ${appnum} задублирован процесс. Всего процессов: ${linkarr.length}. Необходимо удалить один из процессов.</h2>`
          );
          dateTime.getCurrentDateTime();
          console.log(
            `Server: Requset for Camunda link has been processed. Result: PROCESS > 1` + "\n"
          );
        } else {
          res.send(`<h2>По заявке ${appnum} нет действующих процессов!`);
          dateTime.getCurrentDateTime();
          console.log(
            `Server: Requset for Camunda link has been processed. Result: NO PROCESS` + "\n"
          );
        }
      })
      .catch(e => {
        throw e;
      });
  } else {
    res.send(`<h2>Ошибка в номере заявки ${appnum}! Введите корректный номер!</h2>`);
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
      res.send(`<h2>Значение ${uid}: <font color="green">${record[2]}</font></h2>`);
    } else {
      res.send(`<h2>Значение ${uid} не было найдено в локальном справочнике</h2>`);
    }
  } else {
    res.send(`<h2>Невалидное значение UID</h2>`);
  }
});

app.get("/supportold/:appnum", (req, res) => {
  //const {appnum} = req.params;

  res.render("Support_dummy_script");
});

//SUPPORT OLD//////////////////

app.get("/supportold2/:appnum", (req, res) => {
  const { appnum } = req.params;

  if (appnum.length !== 10 || appnum === undefined || appnum === null || isNaN(appnum)) {
    const ip = req.headers["x-forwarded-for"];
    dateTime.getCurrentDateTime();
    console.log(`Server: Request for wrong application name:` + "\n");
    console.log(`Checking first length condition: ${appnum.length !== 10}`);
    console.log(`Checking second undefined condition: ${appnum === undefined}`);
    console.log(`Checking third null condition: ${appnum === null}`);
    console.log(`Checking fourth isNaN condition: ${isNaN(appnum)}`);
    console.log(req.headers);
    res.send(`<h2>Ошибка в номере заявки ${appnum}! Введите корректный номер!</h2>`);
    console.log(`Server: Continue to litening on port: ${port}...` + "\n");
  } else {
    dateTime.getCurrentDateTime();
    console.log(`Checking first length condition: ${appnum.length !== 10}`);
    console.log(`Checking second undefined condition: ${appnum === undefined}`);
    console.log(`Checking third null condition: ${appnum === null}`);
    console.log(`Checking fourth isNaN condition: ${isNaN(appnum)}`);

    const ip1 = req.connection.remoteAddress;
    const ip2 = req.header("x-forwarded-for") || req.connection.remoteAddress;
    if (appnum == "bootstrap.css") {
      res.sendFile(__dirname + "/public/bootstrap.css");
    }
    dateTime.getCurrentDateTime();
    console.log(`Server: Remote host's IP address is: ${ip1}, ${ip2}` + "\n");
    console.log(`Server: Remote host's IP address is: ${req.ip}, ${req.ips}` + "\n");
    dateTime.getCurrentDateTime();
    console.log(`Server: Request for data collection of application has been received:` + "\n");
    console.log(req.headers + "\n");
    console.log(`Server: application number is: ${appnum}` + "\n");
    console.log(`Server: Sending request to the Request Processor: ${appnum}` + "\n");

    //вызываем промис из подключенного модуля

    rp.externalQueryExecutorP(appnum, "processid")
      .then(prArr => {
        dateTime.getCurrentDateTime();
        console.log(
          `Server: Request Processor returned response from externalQueryExecutorP for processid and data is ${prArr}` +
            "\n"
        );

        let jarrt = getJsonResultset(prArr);
        let processid = "";

        if (jarrt.length == 0) {
          dateTime.getCurrentDateTime();
          console.log(`Server: Warning! Active process instance is empty!` + "\n");
          processid = null;
        } else if (jarrt.length > 1) {
          dateTime.getCurrentDateTime();
          console.log(`Server: Warning! PROCESS FOR APPLICATION IS DUPLICATED!` + "\n");
          return res.send(`<div class="alert alert-danger" role="alert" id=processoff>
                    <font size="5">По заявке ${appnum} процесс задублирован!</font></div>
                    <h1>${prArr}</h1>`);
        } else {
          dateTime.getCurrentDateTime();
          console.log(`Server: Active process instance id ${jarrt[0].proc_inst_id_}` + "\n");
          processid = jarrt[0].proc_inst_id_;
        }

        //arrstr2 old
        rp.externalQueryExecutorP(processid, "tasks")
          .then(tskArr => {
            dateTime.getCurrentDateTime();
            console.log(
              `Server: Request Processor returned response from externalQueryExecutorP for tasks` +
                "\n"
            );

            rp.getDataApp(appnum, "search")
              .then(apparr => {
                if (apparr.length == 0) {
                  dateTime.getCurrentDateTime();
                  console.log(
                    `Server: WARNING! There is no Data is searchstoreservice for application ${appnum}` +
                      "\n"
                  );
                  return res.send(
                    `<h1>Нет данных по заявке ${appnum} в сервисе поиска просьба повторить операцию для другой заявки</h1>`
                  );
                }
                dateTime.getCurrentDateTime();
                console.log(`Server: Request Processor returned response from getDataApp` + "\n");
                dateTime.getCurrentDateTime();
                console.log(
                  `Server: Starting to detect the route for application for collection parameters` +
                    "\n"
                );

                //парсинг данных для разбора маршрута
                let test = getJsonResultset(apparr);

                //определение маршрута сбора данных в зависимости от типа заявки

                let route = "";
                let route2 = "";
                let route3 = "";

                if (test[0].credit_type_name == "Потребительское кредитование") {
                  dateTime.getCurrentDateTime();
                  console.log(`Server: Route detected as for ${test[0].credit_type_name}` + "\n");
                  route = "potreb"; //out
                  route2 = "potrebakk"; //out2
                  route3 = "potrebrefin"; //out3
                } else if (
                  test[0].credit_type_name == "Кредитование с использованием банковских карт"
                ) {
                  dateTime.getCurrentDateTime();
                  console.log(`Server: Route detected as for ${test[0].credit_type_name}` + "\n");
                  route = "cc";
                  route2 = "kard_akk"; //out2
                  route3 = "Ignore";
                } else if (test[0].credit_type_name == "Ипотечное кредитование") {
                  dateTime.getCurrentDateTime();
                  console.log(`Server: Route detected as for ${test[0].credit_type_name}` + "\n");
                  route = "ipoteka"; //out
                  route2 = "ipoteka_participant"; //out2
                  route3 = "ipoteka_akk"; //out3
                } else if (test[0].credit_type_name == "Автокредитование") {
                  dateTime.getCurrentDateTime();
                  console.log(`Server: Route detected as for ${test[0].credit_type_name}` + "\n");
                  route = "auto"; //out
                  route2 = "autoakk"; //out2
                  route3 = "vehicle"; //out3
                } else if (!test[0].credit_type_name) {
                  res.send(
                    `Ошибка! Не определен маршрут для сбора данных по заявке ${req.params.appnum}. Попробуйте позднее или по другому номеру заявки`
                  );
                }

                //////////////////////////////

                if (route) {
                  dateTime.getCurrentDateTime();
                  console.log(`Server: Calling for getParemetersData for the ${route}` + "\n");

                  rp.getParemetersData(appnum, route)
                    .then(out => {
                      rp.getParemetersData(appnum, route2)
                        .then(out2 => {
                          rp.getParemetersData(appnum, route3)
                            .then(out3 => {
                              dateTime.getCurrentDateTime();
                              console.log(
                                `Server: Request Processor returned response from getParemetersData for ${route}` +
                                  "\n"
                              );

                              //Интеграционные логи

                              dateTime.getCurrentDateTime();
                              console.log(
                                `Server: Starting to collect integration data for application ${appnum}` +
                                  "\n"
                              );

                              rp.getIntegrationsLog(appnum)
                                .then(function(intarr) {
                                  rp.getDataApp(appnum, "statusview")
                                    .then(appstatusarr => {
                                      rp.getDataApp(appnum, "event")
                                        .then(eventarr => {
                                          dateTime.getCurrentDateTime();
                                          console.log(
                                            `Server: All requests have been processed` + "\n"
                                          );
                                          dateTime.getCurrentDateTime();
                                          console.log(
                                            `Server: Response of externalQueryExecutorP for argument tasks has been successfully received ` +
                                              "\n"
                                          );
                                          dateTime.getCurrentDateTime();
                                          console.log(
                                            `Server: Response of getDataApp has been received` +
                                              "\n"
                                          );
                                          dateTime.getCurrentDateTime();
                                          console.log(
                                            `Server: Response of getParemetersData is` +
                                              "\n" +
                                              `${out}` +
                                              "\n"
                                          );
                                          dateTime.getCurrentDateTime();
                                          console.log(
                                            `Server: Response of clientIntegrationLog has been received` +
                                              "\n"
                                          );
                                          dateTime.getCurrentDateTime();
                                          console.log(
                                            `Server: Response for ${route2} data has been received and is: ${out2}` +
                                              "\n"
                                          );
                                          dateTime.getCurrentDateTime();
                                          console.log(
                                            `Server: Response for ${route3} data has been received and is: ${out3}` +
                                              "\n"
                                          );

                                          const md = new MapperDict();

                                          let jarr = [];
                                          let jarr2 = [];
                                          let jarr3 = [];
                                          let integrationarrayjson = [];
                                          let statarr = [];
                                          let evarr = [];
                                          let out2arr = [];
                                          let out3arr = [];
                                          let out3arrv = [];
                                          //парсинг данных из searchstoreservice
                                          jarr2 = getJsonResultset(apparr);

                                          //potreball kard_akk
                                          if (out2.length !== 0) {
                                            dateTime.getCurrentDateTime();
                                            console.log(
                                              `Server: ${route2} data is NOT empty` + "\n"
                                            );

                                            out2arr = getJsonResultset(out2);

                                            if (
                                              out3.length !== 0 &&
                                              out3[0] !== "Ignore" &&
                                              route3 !== "vehicle"
                                            ) {
                                              dateTime.getCurrentDateTime();
                                              console.log(
                                                `Server:  ${route3} data is NOT empty` + "\n"
                                              );

                                              out3arr = getJsonResultset(out3);
                                            }
                                            if (out3.length !== 0 && route3 === "vehicle") {
                                              dateTime.getCurrentDateTime();
                                              console.log(
                                                `Server:  ${route3} data is NOT empty` + "\n"
                                              );

                                              out3arrv = getJsonResultset(out3);
                                            }

                                            //ipoteka_akk

                                            if (out3.length !== 0 && route3 !== "potrebrefin") {
                                              out3arr.forEach((el, i, array) => {
                                                if (array[i].card_expiration_date !== null) {
                                                  array[i].card_expiration_date = new Date(
                                                    array[i].card_expiration_date
                                                  );
                                                  array[i].card_expiration_date.addHours(3);
                                                  array[i].card_expiration_date = array[
                                                    i
                                                  ].card_expiration_date
                                                    .toISOString()
                                                    .replace("T", " ")
                                                    .replace("Z", "");
                                                }
                                              });
                                            }
                                          } else {
                                            dateTime.getCurrentDateTime();
                                            console.log(`Server: ${route3} Ignore event` + "\n");
                                          }

                                          if (intarr.length !== 0) {
                                            dateTime.getCurrentDateTime();
                                            console.log(
                                              `Server: Integration log is NOT empty` + "\n"
                                            );
                                            //преобразование времени для интеграционных логов
                                            var int_local_time = [];

                                            integrationarrayjson = getJsonResultset(intarr);

                                            integrationarrayjson.forEach((el, i, array) => {
                                              int_local_time[i] = new Date(array[i].interaction_ts);
                                              int_local_time[i].addHours(3);
                                              array[i].interaction_ts = int_local_time[i]
                                                .toISOString()
                                                .replace("T", " ")
                                                .replace("Z", "");
                                            });
                                          }

                                          if (appstatusarr.length !== 0) {
                                            dateTime.getCurrentDateTime();
                                            console.log(
                                              `Server: Integration log is NOT empty` + "\n"
                                            );

                                            statarr = getJsonResultset(appstatusarr);

                                            //преобразование формата даты и времени

                                            statarr.forEach((el, i, array) => {
                                              array[i].start_date = new Date(array[i].start_date);
                                              array[i].start_date.addHours(3);
                                              array[i].start_date = array[i].start_date
                                                .toISOString()
                                                .replace("T", " ")
                                                .replace("Z", "");

                                              if (array[i].end_date !== null) {
                                                array[i].end_date = new Date(array[i].end_date);
                                                array[i].end_date.addHours(3);
                                                array[i].end_date = array[i].end_date
                                                  .toISOString()
                                                  .replace("T", " ")
                                                  .replace("Z", "");
                                              }
                                            });
                                          }

                                          if (eventarr.length !== 0) {
                                            dateTime.getCurrentDateTime();
                                            console.log(`Server: Events log is NOT empty` + "\n");

                                            evarr = getJsonResultset(eventarr);

                                            evarr.forEach((el, i, array) => {
                                              array[i].event_time = new Date(array[i].event_time);
                                              array[i].event_time.addHours(3);
                                              array[i].event_time = array[i].event_time
                                                .toISOString()
                                                .replace("T", " ")
                                                .replace("Z", "");
                                            });
                                          } else {
                                            dateTime.getCurrentDateTime();
                                            console.log(`Server: Integration log is EMPTY` + "\n");
                                          }

                                          //парсинг данных из BPM arrstr2=>tskArr

                                          if (tskArr.length > 0) {
                                            dateTime.getCurrentDateTime();
                                            console.log(
                                              `Server: Starting to parse BPM tasks data` + "\n"
                                            );

                                            jarr = getJsonResultset(tskArr);

                                            jarr.forEach((el, i, array) => {
                                              array[i].start_time_ = new Date(array[i].start_time_);
                                              array[i].start_time_.addHours(3);
                                              array[i].start_time_ = array[i].start_time_
                                                .toISOString()
                                                .replace("T", " ")
                                                .replace("Z", "");

                                              if (array[i].end_time_ !== null) {
                                                array[i].end_time_ = new Date(array[i].end_time_);
                                                array[i].end_time_.addHours(3);
                                                array[i].end_time_ = array[i].end_time_
                                                  .toISOString()
                                                  .replace("T", " ")
                                                  .replace("Z", "");
                                              }
                                            });
                                          }
                                          jarr2.forEach((el, i, array) => {
                                            array[i].creation_date = new Date(
                                              array[i].creation_date
                                            );
                                            array[i].creation_date.addHours(3);
                                            array[i].creation_date = array[i].creation_date
                                              .toISOString()
                                              .replace("T", " ")
                                              .replace("Z", "");

                                            array[i].date_status = new Date(array[i].date_status);
                                            array[i].date_status.addHours(3);
                                            array[i].date_status = array[i].date_status
                                              .toISOString()
                                              .replace("T", " ")
                                              .replace("Z", "");
                                          });
                                          if (
                                            jarr2[jarr2.length - 1].credit_type_name ==
                                              "Потребительское кредитование" ||
                                            jarr2[jarr2.length - 1].credit_type_name ==
                                              "Автокредитование"
                                          ) {
                                            out2arr.forEach((el, i, array) => {
                                              array[i].acc_open_date = new Date(
                                                array[i].acc_open_date
                                              );
                                              array[i].acc_open_date.addHours(3);
                                              array[i].acc_open_date = array[i].acc_open_date
                                                .toISOString()
                                                .replace("T", " ")
                                                .replace("Z", "");
                                            });
                                          }
                                          if (
                                            jarr2[jarr2.length - 1].credit_type_name ==
                                            "Кредитование с использованием банковских карт"
                                          ) {
                                            out2arr.forEach((el, i, array) => {
                                              array[i].card_expiration_date = new Date(
                                                array[i].card_expiration_date
                                              );
                                              array[i].card_expiration_date.addHours(3);
                                              array[i].card_expiration_date = array[
                                                i
                                              ].card_expiration_date
                                                .toISOString()
                                                .replace("T", " ")
                                                .replace("Z", "");
                                            });
                                          }

                                          if (out) {
                                            isParametersEmpty = false;
                                            //парсинг данных параметров заявки

                                            jarr3 = getJsonResultset(out);

                                            jarr3.forEach((el, i, array) => {
                                              if (array[i].date_sign) {
                                                array[i].date_sign = new Date(array[i].date_sign);
                                                array[i].date_sign.addHours(3);
                                                array[i].date_sign = array[i].date_sign
                                                  .toISOString()
                                                  .replace("T", " ")
                                                  .replace("Z", "");
                                                array[i].date_sign = array[i].date_sign.split(
                                                  " "
                                                )[0];
                                              }
                                              //маппинг со справочником
                                              console.log(el.branch_unit_id);
                                              console.log(
                                                `detectDictionaryRecord: ${
                                                  md.detectDictionaryRecord(el.branch_unit_id)[2]
                                                }`
                                              );
                                              el.branch_unit_id
                                                ? (el.branch_unit_id = md.detectDictionaryRecord(
                                                    el.branch_unit_id
                                                  )[2])
                                                : (el.branch_unit_id = null);
                                            });
                                          }

                                          //если нет записей по заявке в БД Camunda_db

                                          if (jarr.length == 0) {
                                            let linkwp = "";

                                            if (
                                              jarr2[jarr2.length - 1].credit_type_name ==
                                              "Кредитование с использованием банковских карт"
                                            ) {
                                              linkwp = `https://ui-test.test-stand.tst.int.***.ru/error-processing/${req.params.appnum}/status-journal`;
                                            } else if (
                                              jarr2[jarr2.length - 1].credit_type_name ==
                                              "Потребительское кредитование"
                                            ) {
                                              linkwp = `https://ui.test-stand.tst.int.***.ru/error-processing/${req.params.appnum}/status-journal`;
                                            } else if (
                                              jarr2[jarr2.length - 1].credit_type_name ==
                                              "Автокредитование"
                                            ) {
                                              linkwp = `https://ui-test2.test-stand.tst.int.***.ru/error-processing/${appnum}/status-journal`;
                                            } else if (
                                              jarr2[jarr2.length - 1].credit_type_name ==
                                              "Ипотечное кредитование"
                                            ) {
                                              linkwp = `https://ui-test.test-stand.tst.int.***.ru/error-processing/${appnum}/status-journal`;
                                            }

                                            if (
                                              jarr2[jarr2.length - 1].credit_type_name ==
                                              "Ипотечное кредитование"
                                            ) {
                                              let akkflagcard2 = [];
                                              let refinflag = [];
                                              res.render("Application_data_without_process", {
                                                appnum: appnum,
                                                appid: jarr2[jarr2.length - 1].application_id,
                                                channel: jarr2[jarr2.length - 1].sale_channel_name,
                                                issue_channel: null,
                                                status: jarr2[jarr2.length - 1].appstatus_name,
                                                appcreationdate:
                                                  jarr2[jarr2.length - 1].creation_date,
                                                method: jarr2[jarr2.length - 1].method,
                                                credittype:
                                                  jarr2[jarr2.length - 1].credit_type_name,
                                                obj: jarr,
                                                obj2: jarr2,
                                                params: jarr3,
                                                int: integrationarrayjson,
                                                stat: statarr,
                                                event: evarr,
                                                link: linkwp,
                                                akkPIP: out3arr,
                                                participant: out2arr,
                                                akkcard: akkflagcard2,
                                                refin: refinflag
                                              });
                                              dateTime.getCurrentDateTime();
                                              console.log(
                                                `Server: Warning! Asked process for ${appnum} is completed` +
                                                  "\n"
                                              );
                                              dateTime.getCurrentDateTime();
                                              console.log(`Server: listening...` + "\n");
                                            } else if (
                                              jarr2[jarr2.length - 1].credit_type_name ==
                                              "Кредитование с использованием банковских карт"
                                            ) {
                                              let akkPIPflag = [];
                                              let refinflag = [];

                                              res.render("Application_data_without_process", {
                                                appnum: appnum,
                                                appid: jarr2[jarr2.length - 1].application_id,
                                                channel: jarr2[jarr2.length - 1].sale_channel_name,
                                                issue_channel:
                                                  jarr2[jarr2.length - 1].issue_channel,
                                                status: jarr2[jarr2.length - 1].appstatus_name,
                                                appcreationdate:
                                                  jarr2[jarr2.length - 1].creation_date,
                                                method: jarr2[jarr2.length - 1].method,
                                                credittype:
                                                  jarr2[jarr2.length - 1].credit_type_name,
                                                obj: jarr,
                                                obj2: jarr2,
                                                params: jarr3,
                                                int: integrationarrayjson,
                                                stat: statarr,
                                                event: evarr,
                                                link: linkwp,
                                                akkcard: out2arr,
                                                akkPIP: akkPIPflag,
                                                refin: refinflag
                                              });
                                              dateTime.getCurrentDateTime();
                                              console.log(
                                                `Server: Warning! Asked process for ${appnum} is completed` +
                                                  "\n"
                                              );
                                              dateTime.getCurrentDateTime();
                                              console.log(`Server: listening...` + "\n");
                                            } else if (
                                              jarr2[jarr2.length - 1].credit_type_name ==
                                              "Потребительское кредитование"
                                            ) {
                                              let akkflagcard = [];
                                              res.render("Application_data_without_process", {
                                                appnum: appnum,
                                                appid: jarr2[jarr2.length - 1].application_id,
                                                channel: jarr2[jarr2.length - 1].sale_channel_name,
                                                issue_channel:
                                                  jarr2[jarr2.length - 1].issue_channel,
                                                status: jarr2[jarr2.length - 1].appstatus_name,
                                                appcreationdate:
                                                  jarr2[jarr2.length - 1].creation_date,
                                                method: jarr2[jarr2.length - 1].method,
                                                credittype:
                                                  jarr2[jarr2.length - 1].credit_type_name,
                                                obj: jarr,
                                                obj2: jarr2,
                                                params: jarr3,
                                                int: integrationarrayjson,
                                                stat: statarr,
                                                event: evarr,
                                                link: linkwp,
                                                akkPIP: out2arr,
                                                refin: out3arr,
                                                akkcard: akkflagcard
                                              });
                                              dateTime.getCurrentDateTime();
                                              console.log(
                                                `Server: Warning! Asked process for ${appnum} is completed` +
                                                  "\n"
                                              );
                                              dateTime.getCurrentDateTime();
                                              console.log(`Server: listening...` + "\n");
                                            } else if (
                                              jarr2[jarr2.length - 1].credit_type_name ==
                                              "Автокредитование"
                                            ) {
                                              let akkflagcard = [];
                                              res.render("Application_data_without_process", {
                                                appnum: appnum,
                                                appid: jarr2[jarr2.length - 1].application_id,
                                                channel: jarr2[jarr2.length - 1].sale_channel_name,
                                                issue_channel:
                                                  jarr2[jarr2.length - 1].issue_channel,
                                                status: jarr2[jarr2.length - 1].appstatus_name,
                                                appcreationdate:
                                                  jarr2[jarr2.length - 1].creation_date,
                                                method: jarr2[jarr2.length - 1].method,
                                                credittype:
                                                  jarr2[jarr2.length - 1].credit_type_name,
                                                obj: jarr,
                                                obj2: jarr2,
                                                params: jarr3,
                                                int: integrationarrayjson,
                                                stat: statarr,
                                                event: evarr,
                                                link: linkwp,
                                                akkPIP: out2arr,
                                                refin: out3arr,
                                                akkcard: akkflagcard,
                                                vehicle: out3arrv
                                              });
                                              dateTime.getCurrentDateTime();
                                              console.log(
                                                `Server: Warning! Asked process for ${appnum} is completed` +
                                                  "\n"
                                              );
                                              dateTime.getCurrentDateTime();
                                              console.log(`Server: listening...` + "\n");
                                            }
                                          }
                                          //если процесс по заявке есть, но нет записей в searchstoreservice
                                          else if (jarr2.length == 0 && jarr.length !== 0) {
                                            let urifull = `https://test.app.rcl.int.***.ru/app/cockpit/default/#/process-instance/${
                                              jarr[jarr.length - 1].proc_inst_id_
                                            }`;
                                            let errortext =
                                              jarr[jarr.length - 1].Error +
                                              " " +
                                              jarr[jarr.length - 1].bError +
                                              " " +
                                              jarr[jarr.length - 1].mError;
                                            res.render("Application_data_without_search", {
                                              link: urifull,
                                              appnum: appnum,
                                              scheme_name: jarr[jarr.length - 1].proc_def_key_,
                                              version: jarr[jarr.length - 1].ver,
                                              task_name: jarr[jarr.length - 1].act_name_,
                                              task_type: jarr[jarr.length - 1].act_type_,
                                              create_date: jarr[jarr.length - 1].start_time_,
                                              task_state: jarr[jarr.length - 1].act_inst_state_,
                                              execID: jarr[jarr.length - 1].execution_id_,
                                              state_time: jarr[jarr.length - 1].start_time_,
                                              error: errortext
                                            });
                                            //res.render('Application_data_without_search', {link: urifull, obj: jarr})
                                            dateTime.getCurrentDateTime();
                                            console.log(
                                              `Server: Warning! Asked app data is empty` + "\n"
                                            );
                                            dateTime.getCurrentDateTime();
                                            console.log(
                                              `Server: Request for ${appnum} successfully processed but empty` +
                                                "\n"
                                            );
                                            console.log(`Server: listening...` + "\n");
                                          } else {
                                            const _uriCamundaBase = `https://test.app.rcl.int.***.ru/app/cockpit/default/#/process-instance/`;

                                            let k1 = Object.keys(jarr[0]);
                                            let k2 = Object.keys(jarr2[0]);

                                            console.log(`Server: Keys 1 is ${k1}` + "\n");
                                            console.log(`Server: Keys 2 is ${k2}` + "\n");
                                            //console.log(`Server: Keys 3 is ${k3}`+'\n')

                                            let errortext =
                                              jarr[jarr.length - 1].Error +
                                              " " +
                                              jarr[jarr.length - 1].bError +
                                              " " +
                                              jarr[jarr.length - 1].mError;
                                            console.log(`Server: Errortext is ${errortext}` + "\n");
                                            let urifull = `${_uriCamundaBase}${
                                              jarr[jarr.length - 1].proc_inst_id_
                                            }`;

                                            //console.log(`keys is ${keysobj}`+'\n')

                                            console.log(
                                              `Server: Scheme_name is ${jarr[0].proc_def_key_}` +
                                                "\n"
                                            );
                                            console.log(
                                              `Server: Actual state is ${jarr[0].act_inst_state_}` +
                                                "\n"
                                            );
                                            console.log(
                                              `Server: Actual task is ${jarr[0].act_name_}` + "\n"
                                            );

                                            if (route == "potreb") {
                                              let linkp = `https://ui.test-stand.tst.int.***.ru/credit-request/${appnum}/photo-album`;
                                              let linterr = `https://ui.test-stand.tst.int.***.ru/error-processing/${appnum}/status-journal`;
                                              res.render("Support_potreb", {
                                                link: urifull,
                                                link2: linkp,
                                                linkerr: linterr,
                                                appnum: appnum,
                                                error: errortext,
                                                obj: jarr,
                                                obj2: jarr2,
                                                params: jarr3,
                                                int: integrationarrayjson,
                                                stat: statarr,
                                                event: evarr,
                                                akk: out2arr,
                                                refin: out3arr
                                              });
                                            }

                                            if (route == "cc") {
                                              let linkcc = `https://ui-test.test-stand.tst.int.***.ru/credit-request/${appnum}/photo-album`;
                                              let linterrcc = `https://ui-test.test-stand.tst.int.***.ru/error-processing/${appnum}/status-journal`;
                                              res.render("Support_card", {
                                                link: urifull,
                                                link2: linkcc,
                                                linkerr: linterrcc,
                                                appnum: appnum,
                                                error: errortext,
                                                obj: jarr,
                                                obj2: jarr2,
                                                params: jarr3,
                                                int: integrationarrayjson,
                                                stat: statarr,
                                                event: evarr,
                                                akk: out2arr
                                              });
                                            }

                                            if (route == "ipoteka") {
                                              let linkalbum = `https://ui-test.test-stand.tst.int.***.ru/credit-request/${appnum}/photo-album`;
                                              let linkstat = `https://ui-test.test-stand.tst.int.***.ru/error-processing/${appnum}/status-journal`;
                                              res.render("Support", {
                                                linkCam: urifull,
                                                link: linkalbum,
                                                link2: linkstat,
                                                appnum: appnum,
                                                error: errortext,
                                                obj: jarr,
                                                obj2: jarr2,
                                                params: jarr3,
                                                int: integrationarrayjson,
                                                stat: statarr,
                                                event: evarr,
                                                akk: out3arr,
                                                participant: out2arr
                                              });
                                            }

                                            if (route == "auto") {
                                              let linkp = `https://ui-test2.test-stand.tst.int.***.ru/credit-request/${appnum}/photo-album`;
                                              let linterr = `https://ui-test2.test-stand.tst.int.***.ru/error-processing/${appnum}/status-journal`;
                                              res.render("Support_auto", {
                                                link: urifull,
                                                link2: linkp,
                                                linkerr: linterr,
                                                appnum: appnum,
                                                error: errortext,
                                                obj: jarr,
                                                obj2: jarr2,
                                                params: jarr3,
                                                int: integrationarrayjson,
                                                stat: statarr,
                                                event: evarr,
                                                akk: out2arr,
                                                refin: out3arr,
                                                vehicle: out3arrv
                                              });
                                            }

                                            dateTime.getCurrentDateTime();
                                            console.log(
                                              `Server: Request for Support for application ${appnum} successfully processed for remote host: ${req.ips}, ${ip2}` +
                                                "\n"
                                            );
                                            console.log(
                                              `Server: Continue to listening on: ${port}` + "\n"
                                            );
                                          }

                                          // }).catch((err) => {throw err;}) //refins end

                                          //  }).catch((err) => {throw err;}) potrebak
                                        })
                                        .catch(err => {
                                          throw err;
                                        });
                                    })
                                    .catch(err => {
                                      throw err;
                                    });
                                })
                                .catch(err => {
                                  throw err;
                                }); //конец resolve getIntegrationsLog
                            })
                            .catch(err => {
                              throw err;
                            }); //ipoteka_akk
                        })
                        .catch(err => {
                          throw err;
                        }); //Ipoteka_participant
                    })
                    .catch(err => {
                      throw err;
                    });
                } // конец обработки getParemetersData

                dateTime.getCurrentDateTime();
                console.log(
                  `Server: Request for Support for application ${appnum} successfully processed for remote host: ${req.ips}, ${ip2}` +
                    "\n"
                );
                console.log(`Server: Continue to listening on: ${port}` + "\n");
              })
              .catch(err => {
                throw err;
              }); //конец getDataApp
          })
          .catch(err => {
            throw err;
          }); //tasks
      })
      .catch(err => {
        throw err;
      }); //processid
  }
});

//////////////////////////////////////////NEW/////////////////////////////////////////

app.get("/supporttest/:appnum", (req, res) => {
  //const {appnum} = req.params;

  const dc = new DataCollector();
  dc.loggerServer(`Handling the entry test request for support ${req.connection.remoteAddress}`);
  res.render("Support_dummy_script_test");
  dc.loggerServer("Entry test template has been rendered");
});

app.get("/support/:appnum", (req, res) => {
  //const {appnum} = req.params;

  const dc = new DataCollector();
  dc.loggerServer(`Handling the entry request for support ${req.connection.remoteAddress}`);

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
  dc.loggerServer(`Received support request for applicaion number ${appnum} from ${ip1}, ${ip2}`);
  dc.loggerServer(`Headers: ${JSON.stringify(req.headers)}`);

  if (appnum.length !== 10 || !appnum || isNaN(appnum)) {
    console.log(req.headers);
    dc.loggerServer(`Bad application number ${appnum}`);
    res.send(`<h2>Ошибка в номере заявки ${appnum}! Введите корректный номер!</h2>`);
  } else {
    const main = async applicationNum => {
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

    main(appnum).then(data => {
      data = JSON.parse(data);
      //console.log(typeof(data));
      //console.log(data.searchData);

      dc.loggerServer(`Received data from dataCollector for application ${appnum}`);

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
            dc.loggerServer(`Application has error text attached: ${data.tasksData[0].Error}`);
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
          linkData: links
        };

        res.render("Support_mortgage", renderMappData);
      } else if (ctp === "Потребительское кредитование") {
        if (data.tasksData.length !== 0) {
          if (data.tasksData[0].Error) {
            dc.loggerServer(`Application has error text attached: ${data.tasksData[0].Error}`);
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
          linkData: links
        };

        res.render("Support2_potreb", renderAppData);
      } else if (ctp === "Кредитование с использованием банковских карт") {
        if (data.tasksData.length !== 0) {
          if (data.tasksData[0].Error) {
            dc.loggerServer(`Application has error text attached: ${data.tasksData[0].Error}`);
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
          linkData: links
        };

        res.render("Support2_card", renderCardAppData);
      } else if (ctp === "Автокредитование") {
        if (data.tasksData.length !== 0) {
          if (data.tasksData[0].Error) {
            dc.loggerServer(`Application has error text attached: ${data.tasksData[0].Error}`);
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
          linkData: links
        };

        res.render("Support2_auto", renderAutoAppData);

        //res.send(`<h1>Страница по заявкам на автокредиты в разработке...</h1>`);
      }

      // res.send(data);
      dc.loggerServer(`Data for application ${appnum} has been successfully processed for ${ip1}`);
      dc.loggerServer("Listening...");
    });
  }
});

app.get("/frontrequest/aggregatedatafromdblight/:appnum", (req, res) => {
  const getSubString = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

  const generateUniqueId = () => getSubString() + getSubString() + "-" + getSubString();

  const requestId = generateUniqueId();

  const { appnum } = req.params;

  const ip1 = req.connection.remoteAddress;
  const ip2 = req.header("x-forwarded-for") || req.connection.remoteAddress;

  req.session.remoteIPAddress = ip1;
  req.session.dbDataCounter ? req.session.dbDataCounter++ : (req.session.dbDataCounter = 1);

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
    res.send(`<h2>Ошибка в номере заявки ${appnum}! Введите корректный номер!</h2>`);
  } else {
    const main = async applicationNum => {
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

    main(appnum).then(data => {
      data = JSON.parse(data);

      dc.loggerServer(`${requestId} Received data from dataCollector for application ${appnum}`);

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
          paramsOksDataSearch: data.paramsOksDataSearch
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
          paramsForSearchLogs: data.paramsForSearchLogs
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
          paramsOksDataSearch: data.paramsOksDataSearch
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
          paramsForSearchLogs: data.paramsForSearchLogs
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

  const main = async applicationNum => {
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

  main(appnum).then(data => {
    data = JSON.parse(data);

    dc.loggerServer(`Received main BPM data from dataCollector for application ${appnum}`);

    if (data.errors.length !== 0) {
      dc.loggerServer(`Main BPM data has error text attached: ${data.errors[0]}`);
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
      errors: data.errors
    };

    res.render("8441_Process_Data", renderAppData);

    // res.send(data);
    dc.loggerServer(`Data for application ${appnum} has been successfully processed for ${ip1}`);
    dc.loggerServer("Listening...");
  });
});

// server.on('request', (req, res) => {
//     dateTime.getCurrentDateTime()
//     console.log(`: Request method: ${req.method}`+'\n')
//     console.log(req.headers);
//     console.log(req.url);

// })

app.listen(port, err => {
  if (err) {
    return console.log("Error", err);
  }

  console.log(`server is listening on ${port}`);
});
