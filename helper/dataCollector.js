const rp = require("../RequestProcessor");
const dateTime = require("../datetime");
const { MapperDict } = require("../mapper");
const { consumerIssueValidationCheck } = require("./issueChecker");
const { elkSearchLogsAuthNeeded } = require("./elk-log-collector");

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

class DataCollector {
  md = new MapperDict();

  dateKeys = [
    "creation_date",
    "date_status",
    "acc_open_date",
    "start_time_",
    "end_time_",
    "event_time",
    "start_date",
    "end_date",
    "interaction_ts",
    "card_expiration_date",
    "date_sign",
    "create_date",
    "prodcat_request_date",
    "date_bki",
    "change_date",
    "card_open_date",
    "contact_office_date",
    "max_conclusion_contract_date",
    "date_sign_ipoteka",
    "document_release_date",
    "rights_registration_date",
    "complete_time",
    "due_date",
    "create_time",
    "duedate_",
    "start_contract_date",
    "report_date",
    "evaluate_date",
    "date_conclusion_contract",
    "date_sub_status",
  ];

  linkData = {
    baseAppLink: `https://ui-test.test-stand.tst.int.***.ru/`,
    baseMappLink: `https://ui-test.test-stand.tst.int.***.ru/`,
    baseCardLink: `https://ui-test.test-stand.tst.int.***.ru/`,
    baseAutoLink: `https://ui-test2.test-stand.tst.int.***.ru/`,
    baseCamundaLink: `https://test.app.rcl.int.***.ru/testpath/app/test/default/#/process-instance/`,
  };

  makeErrorProcessingLink = (appNum, key) => {
    if (appNum) {
      switch (key) {
        case "Потребительское кредитование":
          return (
            this.linkData.baseAppLink +
            `error-processing/${appNum}/status-journal`
          );

        case "Кредитование с использованием банковских карт":
          return (
            this.linkData.baseCardLink +
            `error-processing/${appNum}/status-journal`
          );

        case "Ипотечное кредитование":
          return (
            this.linkData.baseMappLink +
            `error-processing/${appNum}/status-journal`
          );

        case "Автокредитование":
          return (
            this.linkData.baseAutoLink +
            `error-processing/${appNum}/status-journal`
          );

        default:
          throw new Error(
            `DataCollector.makeErrorProcessingLink: Не определено направление ${key}`
          );
      }
    } else {
      this.logger(`Application number is not valid ${appNum}`);
      return;
    }
  };

  makeLink = (appNum, key) => {
    if (appNum) {
      switch (key) {
        case "files_list":
          return this.linkData.baseAppLink + `sling/info/${appNum}`;
        case "ipoteka_lien":
          return this.linkData.baseMappLink + `lien/${appNum}/estate-data`;
        case "ipoteka_history":
          return this.linkData.baseMappLink + `history-real-estate/${appNum}`;
        case "ipoteka_info_mode":
          return (
            this.linkData.baseMappLink +
            `credit-request/${appNum}/application/personal-data?mode=info`
          );
        case "ipoteka_view_mode":
          return this.linkData.baseMappLink + `${appNum}?mode=view`;
        case "ipoteka_final_view_mode":
          return (
            this.linkData.baseMappLink + `contract/${appNum}/final?mode=info`
          );
        case "potreb_redir":
          return this.linkData.baseAppLink + `${appNum}`;
        case "cc_redir":
          return this.linkData.baseCardLink + `${appNum}`;
        case "auto_redir":
          return this.linkData.baseAutoLink + `${appNum}`;
        case "camunda":
          break;
        default:
          throw new Error(
            `DataCollector.makeLink: Не определено направление ${key}`
          );
      }
    } else {
      this.logger(`Application number is not valid ${appNum}`);
      return;
    }
  };

  makeViewScanLink = (appNum, key) => {
    if (appNum) {
      switch (key) {
        case "Потребительское кредитование":
          return (
            this.linkData.baseAppLink + `credit-request/${appNum}/photo-album`
          );

        case "Кредитование с использованием банковских карт":
          return (
            this.linkData.baseCardLink + `credit-request/${appNum}/photo-album`
          );

        case "Ипотечное кредитование":
          return (
            this.linkData.baseMappLink + `credit-request/${appNum}/photo-album`
          );

        case "Автокредитование":
          return (
            this.linkData.baseAutoLink + `credit-request/${appNum}/photo-album`
          );

        default:
          throw new Error(
            `DataCollector.makeViewScanLink: Не определено направление ${key}`
          );
      }
    } else {
      this.logger(
        `makeViewScanLink: Application number is not valid ${appNum}`
      );
      return;
    }
  };

  loggerServer = (message) => {
    dateTime.getCurrentDateTime();
    console.log(`Server: ${message}` + "\n");
  };

  logger = (message) => {
    dateTime.getCurrentDateTime();
    console.log(`DataCollector: ${message}` + "\n");
  };

  jsonParse = (arr) => {
    arr.forEach((el, idx) => {
      arr[idx] = JSON.parse(el);
    });
  };

  formatData = (arr, dateParamName) => {
    arr.forEach((el, idx) => {
      for (let k in el) {
        if (k === dateParamName) {
          if (el[k]) {
            arr[idx][k] = new Date(el[k]);
            arr[idx][k].addHours(3);
            arr[idx][k] = el[k]
              .toISOString()
              .replace("T", " ")
              .replace("Z", "");
          }
        }
      }
    });
  };

  hangChecker = (currentStatus, currentStatusDate) => {
    const automaticStatuses = [
      "Выдача кредита",
      "Автоматическая обработка",
      "Автоматическая обработка ОН",
    ];
  };

  timeDecrementMinutes = (dateTime, minutes) => {
    this.logger(`timeDecrementMinutes: received date: ${dateTime}`);

    dateTime = new Date(dateTime);
    dateTime = dateTime.setMinutes(dateTime.getMinutes() - minutes);
    this.logger(
      `timeDecrementMinutes: result date: ${new Date(dateTime).toISOString()}`
    );
    return new Date(dateTime).toISOString();
  };

  timeIncrementMinutes = (dateTime, minutes) => {
    dateTime = new Date(dateTime);
    dateTime = dateTime.setMinutes(dateTime.getMinutes() + minutes);
    return new Date(dateTime).toISOString();
  };

  formatDataExt = (arr, dateParamNameArr) => {
    arr.forEach((el, idx) => {
      for (let k in el) {
        for (let i = 0; i < dateParamNameArr.length; i++) {
          if (k === dateParamNameArr[i]) {
            if (
              dateParamNameArr[i] === "date_sign" ||
              dateParamNameArr[i] === "date_bki" ||
              dateParamNameArr[i] === "acc_open_date" ||
              dateParamNameArr[i] === "max_conclusion_contract_date" ||
              dateParamNameArr[i] === "start_contract_date"
            ) {
              if (el[k]) {
                arr[idx][k] = new Date(el[k]);
                arr[idx][k].addHours(3);
                arr[idx][k] = arr[idx][k]
                  .toISOString()
                  .replace("T", " ")
                  .replace("Z", "");
                arr[idx][k] = arr[idx][k].split(" ")[0];
              }
            } else {
              if (el[k]) {
                arr[idx] = { ...arr[idx], ...{ ["elk_" + k]: el[k] } };
                arr[idx][k] = new Date(el[k]);
                arr[idx][k].addHours(3);
                arr[idx][k] = arr[idx][k]
                  .toISOString()
                  .replace("T", " ")
                  .replace("Z", "");
              }
            }
          }
        }
      }
    });
  };

  getDictionaryValues = (arr) => {
    if (arr && arr.length > 0) {
      let k = [];

      arr.forEach((el, idx) => {
        for (let key in el) {
          if (el[key]) {
            if (el[key].toString().length === 36) {
              //this.logger(`Detecting value for ${key}: ${el[key]}`);

              k = this.md.detectDictionaryRecord(el[key]);

              if (k[2]) {
                //this.logger(`Values from Dictionary: ${k}`);
                arr[idx][key] = k[2];
              }
            }
          }
        }
      });
    } else return;
  };

  getBicDictionaryValues = (arr) => {
    if (arr && arr.length > 0) {
      let k = [];

      arr.forEach((el, idx) => {
        for (let key in el) {
          if (el[key]) {
            if (el[key].toString().length === 36) {
              k = this.md.detectBicDictionaryRecord(el[key]);

              if (k[2]) {
                arr[idx][key] = k[2] + " " + k[1];
              }
            }
          }
        }
      });
    } else return;
  };

  errorTextCleaner = (array) => {
    array.forEach((el, i) => {
      if (!array[i].Error) {
        array[i].Error = "";
      }
      if (!array[i].bError) {
        array[i].bError = "";
      }
      if (!array[i].mError) {
        array[i].mError = "";
      }
    });
  };

  errorTextCombiner = (arr) => {
    arr.forEach((el, i) => {
      if (arr[i].Error || arr[i].bError || arr[i].mError) {
        arr[i].Error = arr[i].Error + " " + arr[i].bError + " " + arr[i].mError;
      }
    });
  };

  errorArrayFill = (arr) => {
    arr.forEach((el, i) => {
      if (arr[i]) {
        arr[0] += " " + arr[i];
      }
    });
  };

  getDataSet = async (key, route) => {
    let data = [];
    let errorContainer = [];

    switch (route) {
      case "processid":
        data = await rp.externalQueryExecutorP(key, route);
        this.jsonParse(data);
        // this.formatDataExt(data, this.dateKeys);
        return data;
      case "tasks":
        data = await rp.getAsyncData(key, route);
        this.jsonParse(data);
        this.formatDataExt(data, this.dateKeys);
        this.errorTextCleaner(data);
        this.errorTextCombiner(data);
        return data;
      case "error":
        data = await rp.getAsyncData(key, "ERROR_1");
        this.jsonParse(data);

        if (data[0]) {
          if (data[0].mError) {
            errorContainer.push(data[0].mError);
          }
        }
        data = await rp.getAsyncData(key, "ERROR_2");
        this.jsonParse(data);
        if (data[0]) {
          if (data[0].Error) {
            errorContainer.push(data[0].Error);
          }
        }
        data = await rp.getAsyncData(key, "ERROR_3");
        this.jsonParse(data);
        if (data[0]) {
          if (data[0].bError) {
            errorContainer.push(data[0].bError);
          }
        }
        this.errorArrayFill(errorContainer);
        return errorContainer;
      case "search":
        data = await rp.getDataApp(key, route);
        this.jsonParse(data);
        this.formatDataExt(data, this.dateKeys);
        this.getDictionaryValues(data);
        return data;
      case "process_log":
      case "job_data":
      case "tasks_archive":
      case "execution_log":
        data = await rp.getAsyncData(key, route);
        this.jsonParse(data);
        this.formatDataExt(data, this.dateKeys);
        return data;
      case "potreb":
      case "potrebakk":
      case "potrebrefin":
      case "cc":
      case "kard_akk":
      case "Ignore":
      case "ipoteka":
      case "ipoteka_akk":
      case "auto":
      case "autoakk":
      case "vehicle":
        data = await rp.getParemetersData(key, route);
        this.jsonParse(data);
        this.formatDataExt(data, this.dateKeys);
        this.getDictionaryValues(data);
        return data;
      case "logs":
        data = await rp.getIntegrationsLog(key);
        this.jsonParse(data);
        this.formatDataExt(data, this.dateKeys);
        return data;
      case "statusview":
      case "event":
        data = await rp.getDataApp(key, route);
        this.jsonParse(data);
        this.formatDataExt(data, this.dateKeys);
        return data;
      case "ipoteka_real_estate":
      case "letter_of_credit":
      case "letter_of_credit_primary":
      case "transfer_order":
      case "evaluation_report":
        data = await rp.getAsyncData(key, route);
        this.jsonParse(data);
        this.formatDataExt(data, this.dateKeys);
        this.getDictionaryValues(data);
        this.getBicDictionaryValues(data);
        return data;
      case "application":
      case "potrebrefin_all":
      case "ccapplication":
      case "auto_application":
      case "contract_card":
      case "legal_document":
      case "agreement_purchase":
      case "ipoteka_participant":
      case "mapplication":
        data = await rp.getAsyncData(key, route);
        this.jsonParse(data);
        this.formatDataExt(data, this.dateKeys);
        this.getDictionaryValues(data);
        return data;
      case "ipoteka_real_estate_2":
        data = await rp.getAsyncData(key, route);
        this.jsonParse(data);
        this.formatDataExt(data, this.dateKeys);
        this.getDictionaryValues(data);
        return data;
      case "auto_client":
      case "m_client":
      case "consumer_client":
      case "card_client":
        data = await rp.getAsyncData(key, route);
        this.jsonParse(data);
        return data;
      default:
        throw new Error(
          "dataCollector.getDataSet: Ну удалось опередлить маршрут"
        );
    }
  };

  getMortgageData = async (appNum) => {
    const routes = {
      process: "processid",
      tasks: "tasks",
      executions: "execution_log",
      application: "mapplication",
      processLog: "process_log",
      tasksArch: "tasks_archive",
      job: "job_data",
      route: "ipoteka",
      route2: "ipoteka_participant",
      route3: "ipoteka_akk",
      route4: "ipoteka_real_estate",
      route5: "ipoteka_real_estate_2",
      route6: "letter_of_credit",
      route7: "transfer_order",
      route8: "legal_document",
    };

    try {
      let processData = await this.getDataSet(appNum, routes.process);

      let processid = undefined;
      processData.length == 1
        ? (processid = processData[0].proc_inst_id_)
        : (processid = undefined);
      let tasksArchData = [];
      let tasksData = [];
      if (processData.length === 0) {
        tasksArchData = await this.getDataSet(appNum, routes.tasksArch);
      }
      if (processData.length === 1) {
        tasksData = await this.getDataSet(processid, routes.tasks);
      }
      let executionsLogData = await this.getDataSet(appNum, routes.executions);
      let processLogData = await this.getDataSet(appNum, routes.processLog);
      let jobData = await this.getDataSet(appNum, routes.job);
      let mapplicationData = await this.getDataSet(appNum, routes.application);
      let parametersData = await this.getDataSet(appNum, routes.route);
      let mortgageParticipantsData = await this.getDataSet(
        appNum,
        routes.route2
      );
      let mortgageAccountsData = await this.getDataSet(appNum, routes.route3);
      //this.logger(`Starting to collect data for route ${routes.route4} and application ${appNum}`);
      let mortgageRealEstateData = await this.getDataSet(appNum, routes.route4);
      let realEstateId = undefined;
      mortgageRealEstateData.length > 0
        ? (realEstateId = mortgageRealEstateData[0].id)
        : (realEstateId = undefined);
      //this.logger(`Starting to collect data for route ${routes.route5} and application ${appNum}`);
      let mortgageRealEstateData2 = await this.getDataSet(
        realEstateId,
        routes.route5
      );
      //this.logger(`Starting to collect data for route ${routes.route6} and application ${appNum}`);
      let letterOfCreditData = await this.getDataSet(appNum, routes.route6);
      //this.logger(`Starting to collect data for route ${routes.route7} and application ${appNum}`);
      let transferOrderData = await this.getDataSet(appNum, routes.route7);
      //this.logger(`Starting to collect data for route logs and application ${appNum}`);
      let legalDocumentData = await this.getDataSet(appNum, routes.route8);
      let integrationLogData = await this.getDataSet(appNum, "logs");
      //this.logger(`Starting to collect data for route statusview and application ${appNum}`);
      let statusViewData = await this.getDataSet(appNum, "statusview");
      //this.logger(`Starting to collect data for route event and application ${appNum}`);
      let eventData = await this.getDataSet(appNum, "event");
      this.logger("All data for mortgage application has been collected");

      let response = {
        processData,
        tasksData,
        tasksArchData,
        executionsLogData,
        processLogData,
        jobData,
        mapplicationData,
        parametersData,
        mortgageParticipantsData,
        mortgageAccountsData,
        mortgageRealEstateData,
        mortgageRealEstateData2,
        letterOfCreditData,
        transferOrderData,
        legalDocumentData,
        integrationLogData,
        statusViewData,
        eventData,
      };
      return response;
    } catch (e) {
      throw e;
    }
  };

  getBPMprocessData = async (appNum) => {
    const process_routes = {
      process: "processid",
      tasks: "tasks",
      tasksArch: "tasks_archive",
      executions: "execution_log",
      processLog: "process_log",
      job: "job_data",
      errors: "error",
    };

    let errors = [];
    let tasksArchData = [];
    let tasksData = [];

    try {
      const processData = await this.getDataSet(appNum, process_routes.process);
      let processid = undefined;
      processData.length == 1
        ? (processid = processData[0].proc_inst_id_)
        : (processid = undefined);
      errors = await this.getDataSet(processid, process_routes.errors);

      if (processData.length === 0) {
        tasksArchData = await this.getDataSet(appNum, process_routes.tasksArch);
      }
      if (processData.length === 1) {
        tasksData = await this.getDataSet(processid, process_routes.tasks);
      }
      const executionsLogData = await this.getDataSet(
        appNum,
        process_routes.executions
      );
      const processLogData = await this.getDataSet(
        appNum,
        process_routes.processLog
      );
      const jobData = await this.getDataSet(appNum, process_routes.job);
      //console.log(errors);

      const response = {
        processData,
        tasksData,
        tasksArchData,
        executionsLogData,
        processLogData,
        jobData,
        errors,
      };

      return JSON.stringify(response);
    } catch (e) {
      throw new Error(`dataCollector.getBPMprocessData: ${e}`);
    }
  };

  getAutoApplicationDataLight = async (appNum) => {
    const routes = {
      application: "auto_application",
      route: "auto",
      route2: "autoakk",
      route3: "vehicle",
    };

    try {
      let autoApplicationData = await this.getDataSet(
        appNum,
        routes.application
      );
      let parametersData = await this.getDataSet(appNum, routes.route);
      let autoAccountsData = await this.getDataSet(appNum, routes.route2);
      let autoVehicleData = await this.getDataSet(appNum, routes.route3);
      let integrationLogData = await this.getDataSet(appNum, "logs");
      let statusViewData = await this.getDataSet(appNum, "statusview");
      let eventData = await this.getDataSet(appNum, "event");

      let idx = autoAccountsData.findIndex(
        (account) => account.selected === true
      );

      let paramsForSearchLogs = [
        appNum,
        autoApplicationData[0].id,
        this.timeDecrementMinutes(autoApplicationData[0].elk_date_status, 1),
        this.timeIncrementMinutes(autoApplicationData[0].elk_date_status, 1),
        autoApplicationData[0].app_ikar_number,
        idx != -1 ? autoAccountsData[idx].acc_number : appNum,
        idx != -1 ? autoAccountsData[idx].card_number : appNum,
        idx != -1 ? autoAccountsData[idx].five_nt_contract_number : appNum,
        integrationLogData.length > 0
          ? integrationLogData[0].interaction_id
          : appNum,
        autoApplicationData[0].request_service_id,
      ];

      this.logger("All data for auto credit application has been collected");
      let response = {
        autoApplicationData,
        parametersData,
        autoAccountsData,
        autoVehicleData,
        integrationLogData,
        statusViewData,
        eventData,
        paramsForSearchLogs,
      };
      return response;
    } catch (e) {
      throw e;
    }
  };

  getMortgageDataLight = async (appNum) => {
    const routes = {
      application: "mapplication",
      route: "ipoteka",
      route2: "ipoteka_participant",
      route3: "ipoteka_akk",
      route4: "ipoteka_real_estate",
      route5: "ipoteka_real_estate_2",
      route6: "letter_of_credit",
      route7: "transfer_order",
      route8: "legal_document",
      route9: "letter_of_credit_primary",
      route10: "evaluation_report",
      route11: "agreement_purchase",
    };

    try {
      let letterOfCreditData = [];
      let evaluationReportData = [];
      let agreementPurchaseData = [];
      let mapplicationData = await this.getDataSet(appNum, routes.application);
      let parametersData = await this.getDataSet(appNum, routes.route);
      let mortgageParticipantsData = await this.getDataSet(
        appNum,
        routes.route2
      );
      let mortgageAccountsData = await this.getDataSet(appNum, routes.route3);
      let mortgageRealEstateData = await this.getDataSet(appNum, routes.route4);
      let realEstateId = undefined;
      mortgageRealEstateData.length > 0
        ? (realEstateId = mortgageRealEstateData[0].id)
        : (realEstateId = undefined);
      let mortgageRealEstateData2 = await this.getDataSet(
        realEstateId,
        routes.route5
      );
      if (mapplicationData[0].calculation_form_id === "Договор аккредитива") {
        if (parametersData[0].case_market === "Вторичный") {
          letterOfCreditData = await this.getDataSet(appNum, routes.route6);
        }
        if (parametersData[0].case_market === "Первичный") {
          letterOfCreditData = await this.getDataSet(appNum, routes.route9);
        }
      }
      if (realEstateId) {
        evaluationReportData = await this.getDataSet(
          realEstateId,
          routes.route10
        );
        agreementPurchaseData = await this.getDataSet(
          realEstateId,
          routes.route11
        );
      }
      let transferOrderData = await this.getDataSet(appNum, routes.route7);
      let legalDocumentData = await this.getDataSet(appNum, routes.route8);
      let integrationLogData = await this.getDataSet(appNum, "logs");
      let statusViewData = await this.getDataSet(appNum, "statusview");
      let eventData = await this.getDataSet(appNum, "event");
      let elkHits = [];
      let paramsForSearchLogs = [];

      //this.logger(`applicationData for log search: `);
      //console.log(applicationData[0]);
      let idx = -1;
      let idx2 = -1;
      let idx3 = -1;
      let idx4 = -1;

      if (transferOrderData.length > 0) {
        idx = transferOrderData.findIndex(
          (order) => order.is_deleted === false
        );
      }

      if (mortgageAccountsData.length > 0) {
        idx2 = mortgageAccountsData.findIndex(
          (account) => account.selected === true
        );
      }

      if (mortgageRealEstateData2.length > 0) {
        idx3 = mortgageRealEstateData2.findIndex(
          (estate) => estate.is_deleted === false
        );
      }

      if (agreementPurchaseData.length > 0) {
        idx4 = 0;
      }

      paramsForSearchLogs = [
        appNum,
        mapplicationData[0].id,
        this.timeDecrementMinutes(mapplicationData[0].elk_date_status, 1),
        this.timeIncrementMinutes(mapplicationData[0].elk_date_status, 1),
        mapplicationData[0].app_ikar_number
          ? mapplicationData[0].app_ikar_number
          : appNum,
        parametersData[0].five_nt_request_id
          ? parametersData[0].five_nt_request_id
          : appNum,
        letterOfCreditData.length > 0
          ? letterOfCreditData[0].leter_of_credit_5nt_id
          : appNum,
        idx != -1 ? transferOrderData[idx].transfer_id_5nt : appNum,
        idx2 != -1 ? mortgageAccountsData[idx2].acc_number : appNum,
        idx3 != -1 ? mortgageRealEstateData2[idx3].id : appNum,
        idx4 != -1 ? agreementPurchaseData[idx4].id : appNum,
      ];

      //elkHits = await elkSearchLogsAuthNeeded(paramsForSearchLogs);

      // additionalSupportData = consumerIssueValidationCheck({
      //     appStatus: ccapplicationData[0].app_status_id,
      //     appSaleChannel: ccapplicationData[0].sale_channel_id,
      //     formTypeId: ccapplicationData[0].type_id,
      //     dateSign: null
      // }, statusViewData);

      this.logger("All data for mortgage application has been collected");

      let response = {
        mapplicationData,
        parametersData,
        mortgageParticipantsData,
        mortgageAccountsData,
        mortgageRealEstateData,
        mortgageRealEstateData2,
        letterOfCreditData,
        transferOrderData,
        legalDocumentData,
        evaluationReportData,
        agreementPurchaseData,
        integrationLogData,
        statusViewData,
        eventData,
        elkHits,
        paramsForSearchLogs,
      };
      return response;
    } catch (e) {
      throw e;
    }
  };

  getConsumerLoanDataLight = async (appNum) => {
    const routes = {
      application: "application",
      route: "potreb",
      route2: "potrebakk",
      route3: "potrebrefin",
      refinance_liabilities: "potrebrefin_all",
    };

    let paramsForSearchLogs = [];

    try {
      let applicationData = await this.getDataSet(appNum, routes.application);
      let parametersData = await this.getDataSet(appNum, routes.route);
      let consumerAccountsData = await this.getDataSet(appNum, routes.route2);
      let consumerRefinData = await this.getDataSet(appNum, routes.route3);
      let consumerRefinAllData = await this.getDataSet(
        appNum,
        routes.refinance_liabilities
      );
      let integrationLogData = await this.getDataSet(appNum, "logs");
      let statusViewData = await this.getDataSet(appNum, "statusview");
      let eventData = await this.getDataSet(appNum, "event");
      let additionalSupportData = null;
      let elkHits = [];
      let elkHits2 = [];
      let paramsOksDataSearch = [];

      const idx2 = consumerAccountsData.findIndex(
        (account) => account.selected === true
      );

      let paramsForSearchLogs = [
        appNum,
        applicationData[0].id,
        this.timeDecrementMinutes(applicationData[0].elk_date_status, 1),
        this.timeIncrementMinutes(applicationData[0].elk_date_status, 1),
        idx2 == -1 ? appNum : consumerAccountsData[idx2].acc_number,
        applicationData[0].app_ikar_number
          ? applicationData[0].app_ikar_number
          : appNum,
        applicationData[0].request_service_id
          ? applicationData[0].request_service_id
          : appNum,
        applicationData[0].oks_app_sequence
          ? applicationData[0].oks_app_sequence
          : appNum,
        integrationLogData.length > 0
          ? integrationLogData[0].interaction_id
          : appNum,
      ];

      // if (applicationData[0].request_service_id || applicationData[0].oks_app_sequence) {

      //     paramsOksDataSearch = [
      //         appNum,
      //         applicationData[0].id,
      //         this.timeDecrementMinutes(applicationData[0].elk_creation_date, 2),
      //         this.timeIncrementMinutes(applicationData[0].elk_creation_date, 2),
      //         applicationData[0].request_service_id,
      //         applicationData[0].oks_app_sequence
      //     ]

      // }

      if (
        applicationData[0].app_status_id == "Выдача кредита" ||
        applicationData[0].app_status_id == "Ошибка"
      ) {
        //this.logger(`applicationData for log search: `);
        //console.log(applicationData[0]);

        const idx = parametersData.findIndex(
          (parameter) => parameter.date_sign !== null
        );

        if (idx != -1) {
          additionalSupportData = consumerIssueValidationCheck(
            {
              appStatus: applicationData[0].app_status_id,
              appSaleChannel: applicationData[0].sale_channel_id,
              formTypeId: applicationData[0].type_id,
              dateSign: parametersData[idx].date_sign,
              issueChannel: applicationData[0].channel_of_issue,
            },
            statusViewData
          );
        } else {
          additionalSupportData = consumerIssueValidationCheck(
            {
              appStatus: applicationData[0].app_status_id,
              appSaleChannel: applicationData[0].sale_channel_id,
              formTypeId: applicationData[0].type_id,
              dateSign: null,
            },
            statusViewData
          );
        }
      }

      this.logger(
        "All data for consumer credit application has been collected"
      );
      let response = {
        applicationData,
        parametersData,
        consumerAccountsData,
        consumerRefinData,
        consumerRefinAllData,
        integrationLogData,
        statusViewData,
        eventData,
        additionalSupportData,
        paramsForSearchLogs,
        paramsOksDataSearch,
      };
      return response;
    } catch (e) {
      throw e;
    }
  };

  getCreditCardDataLight = async (appNum) => {
    const routes = {
      application: "ccapplication",
      route: "cc",
      route2: "kard_akk",
      route3: "contract_card",
    };

    try {
      let ccapplicationData = await this.getDataSet(appNum, routes.application);
      let parametersData = await this.getDataSet(appNum, routes.route);
      let cardAccountsData = await this.getDataSet(appNum, routes.route2);
      let contractCardData = await this.getDataSet(appNum, routes.route3);
      let integrationLogData = await this.getDataSet(appNum, "logs");
      let statusViewData = await this.getDataSet(appNum, "statusview");
      let eventData = await this.getDataSet(appNum, "event");
      let additionalSupportData;
      let elkHits = [];
      let elkHits2 = [];
      let paramsOksDataSearch = [];

      // if (ccapplicationData[0].app_channel_number || ccapplicationData[0].request_service_id) {

      //     paramsOksDataSearch = [
      //         appNum,
      //         ccapplicationData[0].id,
      //         this.timeDecrementMinutes(ccapplicationData[0].elk_creation_date, 5),
      //         this.timeIncrementMinutes(ccapplicationData[0].elk_creation_date, 2),
      //         ccapplicationData[0].app_channel_number,
      //         ccapplicationData[0].request_service_id
      //     ]

      // }

      let paramsForSearchLogs = [
        appNum,
        ccapplicationData[0].id,
        this.timeDecrementMinutes(ccapplicationData[0].elk_date_status, 1),
        this.timeIncrementMinutes(ccapplicationData[0].elk_date_status, 1),
        cardAccountsData.length > 0 ? cardAccountsData[0].card_number : appNum,
        ccapplicationData[0].app_channel_number
          ? ccapplicationData[0].app_channel_number
          : appNum,
        parametersData[0].five_nt_request_id
          ? parametersData[0].five_nt_request_id
          : appNum,
        integrationLogData.length > 0
          ? integrationLogData[0].interaction_id
          : appNum,
        ccapplicationData[0].request_service_id,
      ];

      this.logger("All data for credit card application has been collected");
      let response = {
        ccapplicationData,
        parametersData,
        cardAccountsData,
        contractCardData,
        integrationLogData,
        statusViewData,
        eventData,
        paramsForSearchLogs,
        paramsOksDataSearch,
      };
      return response;
    } catch (e) {
      throw e;
    }
  };

  getConsumerLoanData = async (appNum) => {
    const routes = {
      process: "processid",
      tasks: "tasks",
      tasksArch: "tasks_archive",
      executions: "execution_log",
      processLog: "process_log",
      job: "job_data",
      application: "application",
      route: "potreb",
      route2: "potrebakk",
      route3: "potrebrefin",
      refinance_liabilities: "potrebrefin_all",
    };

    try {
      let processData = await this.getDataSet(appNum, routes.process);
      let processid = undefined;
      processData.length > 0
        ? (processid = processData[0].proc_inst_id_)
        : (processid = undefined);
      let tasksArchData = [];
      let tasksData = [];
      if (processData.length === 0) {
        tasksArchData = await this.getDataSet(appNum, routes.tasksArch);
      }
      if (processData.length === 1) {
        tasksData = await this.getDataSet(processid, routes.tasks);
      }
      let executionsLogData = await this.getDataSet(appNum, routes.executions);
      let processLogData = await this.getDataSet(appNum, routes.processLog);
      let jobData = await this.getDataSet(appNum, routes.job);
      let applicationData = await this.getDataSet(appNum, routes.application);
      let parametersData = await this.getDataSet(appNum, routes.route);
      let consumerAccountsData = await this.getDataSet(appNum, routes.route2);
      let consumerRefinData = await this.getDataSet(appNum, routes.route3);
      let consumerRefinAllData = await this.getDataSet(
        appNum,
        routes.refinance_liabilities
      );
      let integrationLogData = await this.getDataSet(appNum, "logs");
      let statusViewData = await this.getDataSet(appNum, "statusview");
      let eventData = await this.getDataSet(appNum, "event");

      this.logger(
        "All data for consumer credit application has been collected"
      );
      let response = {
        processData,
        tasksData,
        tasksArchData,
        executionsLogData,
        processLogData,
        jobData,
        applicationData,
        parametersData,
        consumerAccountsData,
        consumerRefinData,
        consumerRefinAllData,
        integrationLogData,
        statusViewData,
        eventData,
      };
      return response;
    } catch (e) {
      throw e;
    }
  };

  getCreditCardData = async (appNum) => {
    const routes = {
      process: "processid",
      tasks: "tasks",
      tasksArch: "tasks_archive",
      executions: "execution_log",
      processLog: "process_log",
      job: "job_data",
      application: "ccapplication",
      route: "cc",
      route2: "kard_akk",
      route3: "contract_card",
    };

    try {
      let processData = await this.getDataSet(appNum, routes.process);
      let processid = undefined;
      processData.length == 1
        ? (processid = processData[0].proc_inst_id_)
        : (processid = undefined);
      let tasksArchData = [];
      let tasksData = [];
      if (processData.length === 0) {
        tasksArchData = await this.getDataSet(appNum, routes.tasksArch);
      }
      if (processData.length === 1) {
        tasksData = await this.getDataSet(processid, routes.tasks);
      }
      let executionsLogData = await this.getDataSet(appNum, routes.executions);
      let processLogData = await this.getDataSet(appNum, routes.processLog);
      let jobData = await this.getDataSet(appNum, routes.job);
      let ccapplicationData = await this.getDataSet(appNum, routes.application);
      let parametersData = await this.getDataSet(appNum, routes.route);
      let cardAccountsData = await this.getDataSet(appNum, routes.route2);
      let contractCardData = await this.getDataSet(appNum, routes.route3);
      let integrationLogData = await this.getDataSet(appNum, "logs");
      let statusViewData = await this.getDataSet(appNum, "statusview");
      let eventData = await this.getDataSet(appNum, "event");

      this.logger("All data for credit card application has been collected");
      let response = {
        processData,
        tasksData,
        tasksArchData,
        executionsLogData,
        processLogData,
        jobData,
        ccapplicationData,
        parametersData,
        cardAccountsData,
        contractCardData,
        integrationLogData,
        statusViewData,
        eventData,
      };
      return response;
    } catch (e) {
      throw e;
    }
  };

  getAutoApplicationData = async (appNum) => {
    const routes = {
      process: "processid",
      tasks: "tasks",
      tasksArch: "tasks_archive",
      executions: "execution_log",
      processLog: "process_log",
      job: "job_data",
      application: "auto_application",
      route: "auto",
      route2: "autoakk",
      route3: "vehicle",
    };

    try {
      let processData = await this.getDataSet(appNum, routes.process);
      let processid = undefined;
      processData.length == 1
        ? (processid = processData[0].proc_inst_id_)
        : (processid = undefined);
      let tasksArchData = [];
      let tasksData = [];
      if (processData.length === 0) {
        tasksArchData = await this.getDataSet(appNum, routes.tasksArch);
      }
      if (processData.length === 1) {
        tasksData = await this.getDataSet(processid, routes.tasks);
      }
      let executionsLogData = await this.getDataSet(appNum, routes.executions);
      let processLogData = await this.getDataSet(appNum, routes.processLog);
      let jobData = await this.getDataSet(appNum, routes.job);
      let autoApplicationData = await this.getDataSet(
        appNum,
        routes.application
      );
      let parametersData = await this.getDataSet(appNum, routes.route);
      let autoAccountsData = await this.getDataSet(appNum, routes.route2);
      let autoVehicleData = await this.getDataSet(appNum, routes.route3);
      let integrationLogData = await this.getDataSet(appNum, "logs");
      let statusViewData = await this.getDataSet(appNum, "statusview");
      let eventData = await this.getDataSet(appNum, "event");

      this.logger("All data for auto credit application has been collected");
      let response = {
        processData,
        tasksData,
        tasksArchData,
        executionsLogData,
        processLogData,
        jobData,
        autoApplicationData,
        parametersData,
        autoAccountsData,
        autoVehicleData,
        integrationLogData,
        statusViewData,
        eventData,
      };
      return response;
    } catch (e) {
      throw e;
    }
  };

  collectDataLight = async (applicationNum, isAnalyze = false) => {
    dateTime.getCurrentDateTime();
    console.log(
      `DataCollector: Received request to collect data for ${applicationNum} isAnalyze: ${isAnalyze}` +
        "\n"
    );

    // let process = await rp.externalQueryExecutorP(applicationNum, 'processid'); //process
    // process = getJsonResultset(process);
    // this.logger('Process data has been processed');
    // process.length > 0 ? processid = process[0].proc_inst_id_ : processid = null;

    // let tasks = await rp.externalQueryExecutorP(processid, 'tasks'); //tasks
    // tasks = getJsonResultset(tasks);
    // this.logger('Task data has been processed');

    let searchData = await this.getDataSet(applicationNum, "search"); //searchData
    this.logger("Search data has been processed");
    if (searchData.length === 0) {
      throw new Error(
        `DataCollector.collectData: нет данных в сервисе поиска (searchstoreservice) о направлении кредитования по заявке ${applicationNum}. Возможно заявка не дошла до этапа создания (если это ЗНО из внешних каналов: Сайт, ДБО, Агрегатор, Партнер (API)), либо была ошибка при сохранении данных в сервис поиска, либо ошиблись в номере заявки.<h3>Попробуйте проверить заявку через сервис <a href="http://localhost:3000/tocamunda/${applicationNum}" target="_blank"><font size="20px">Проверить в Camunda</font></a></h3><br>Или через анализатор<a href="http://localhost:3000/analyze/${applicationNum}" target="_blank"><font size="20px">Анализ заявки</font><br><a href="http://localhost:3000/index" target="_blank"><font size="20px">На главную</font>`
      );
    }
    const { credit_type_name: credTypeName } = searchData[0];
    //console.log(searchData);
    //this.logger('credTypeName: ');
    //this.logger(credTypeName)
    let data = {};
    let resultData = {};

    switch (credTypeName) {
      case "Потребительское кредитование":
        this.logger(`Route detected as potreb`);
        data = await this.getConsumerLoanDataLight(applicationNum);
        resultData = { ...data, searchData };
        return JSON.stringify(resultData);
      case "Кредитование с использованием банковских карт":
        this.logger(`Route detected as credit card`);
        data = await this.getCreditCardDataLight(applicationNum);
        resultData = { ...data, searchData };
        return JSON.stringify(resultData);
      case "Ипотечное кредитование":
        this.logger(`Route detected as ipoteka`);
        data = await this.getMortgageDataLight(applicationNum);
        resultData = { ...data, searchData };
        return JSON.stringify(resultData);
      case "Автокредитование":
        this.logger(`Route detected as auto`);
        data = await this.getAutoApplicationDataLight(applicationNum);
        resultData = { ...data, searchData };
        return JSON.stringify(resultData);
      default:
        throw new Error(
          `DataCollector.collectData: Не удалось определить маршрут заявки! Но вы можете попробовтать поискать данные BPM заявки и выполнить поиск логов <a href="http://localhost:3000/analyze/${applicationNum}" target="_blank"><font size="20px">здесь</font></a>`
        );
    }
  };

  collectDataByRoute = async (route, collectedData) => {
    switch (route) {
      case "auto_application":
        route = "auto_client";
        data = await this.getDataSet(applicationNum, route);
        resultData = { ...data, collectedData };
        return resultData;
      case "mapplication":
        route = "m_client";
        data = await this.getDataSet(applicationNum, route);
        resultData = { ...data, collectedData };
        return resultData;
      case "application":
        route = "consumer_client";
        data = await this.getDataSet(applicationNum, route);
        resultData = { ...data, collectedData };
        return resultData;
      case "ccapplication":
        route = "card_client";
        data = await this.getDataSet(applicationNum, route);
        resultData = { ...data, collectedData };
        return resultData;
    }
  };

  filterAndFormatAdditionalData = (data) => {
    if (data.length > 0) {
      let result = [];

      data.forEach((parameter) => {
        for (let key in parameter) {
          switch (key) {
            case "app_sequence":
              result.push(parameter[key]);
              break;
            case "oks_app_sequence":
              result.push(parameter[key]);
              break;
            case "app_ikar_number":
              result.push(parameter[key]);
              break;
            case "request_service_id":
              result.push(parameter[key]);
              break;
            case "app_channel_number":
              result.push(parameter[key]);
              break;
            case "doc_num":
              result.push(parameter[key]);
              break;
            case "birth_date":
              result.push(parameter[key]);
              break;
          }
        }
      });

      result[0] = data[0].app_sequence;

      return result;
    }
  };

  analyzeCollectData = async (applicationNum) => {
    this.logger(`analyzeCollectData enter for application ${applicationNum}`);

    const routes = [
      "auto_application",
      "mapplication",
      "application",
      "ccapplication",
    ];

    try {
      this.logger(`Trying to detect application direction`);

      routes.forEach((route, i) => {
        this.getDataSet(applicationNum, route).then((searchParameters) => {
          if (searchParameters.length == 0) {
            this.logger(
              `Iteration ${i} application ${applicationNum} does not match to direction ${route}`
            );
          }

          if (searchParameters.length != 0) {
            this.logger(
              `Iteration ${i} application ${applicationNum} match to direction ${route}`
            );
            this.collectDataByRoute(route, searchParameters).then((result) => {
              result = this.filterAndFormatAdditionalData(result);
              console.log(result);
              return result;
            });
          }
        });
      });
    } catch (e) {
      throw new Error(`analyzeCollectData exception: ${e}`);
    }
  };

  collectData = async (applicationNum) => {
    dateTime.getCurrentDateTime();
    console.log(
      `DataCollector: Received request to collect data for ${applicationNum}` +
        "\n"
    );

    // let process = await rp.externalQueryExecutorP(applicationNum, 'processid'); //process
    // process = getJsonResultset(process);
    // this.logger('Process data has been processed');
    // process.length > 0 ? processid = process[0].proc_inst_id_ : processid = null;

    // let tasks = await rp.externalQueryExecutorP(processid, 'tasks'); //tasks
    // tasks = getJsonResultset(tasks);
    // this.logger('Task data has been processed');

    let searchData = await this.getDataSet(applicationNum, "search"); //searchData
    this.logger("Search data has been processed");
    if (searchData.length === 0) {
      throw new Error(
        `DataCollector.collectData: нет данных в сервисе поиска (searchstoreservice) о направлении кредитования по заявке ${applicationNum}. Возможно заявка не дошла до этапа создания (если это ЗНО из внешних каналов: Сайт, ДБО, Агрегатор, Партнер (API)), либо была ошибка при сохранении данных в сервис поиска, либо ошиблись в номере заявки.`
      );
    }
    const { credit_type_name: credTypeName } = searchData[0];
    //console.log(searchData);
    //this.logger('credTypeName: ');
    //this.logger(credTypeName)
    let data = {};
    let resultData = {};

    switch (credTypeName) {
      case "Потребительское кредитование":
        this.logger(`Route detected as potreb`);
        data = await this.getConsumerLoanData(applicationNum);
        resultData = { ...data, searchData };
        return JSON.stringify(resultData);
      case "Кредитование с использованием банковских карт":
        this.logger(`Route detected as credit card`);
        data = await this.getCreditCardData(applicationNum);
        resultData = { ...data, searchData };
        return JSON.stringify(resultData);
      case "Ипотечное кредитование":
        this.logger(`Route detected as ipoteka`);
        data = await this.getMortgageData(applicationNum);
        resultData = { ...data, searchData };
        return JSON.stringify(resultData);
      case "Автокредитование":
        this.logger(`Route detected as auto`);
        data = await this.getAutoApplicationData(applicationNum);
        resultData = { ...data, searchData };
        return JSON.stringify(resultData);
      default:
        throw new Error(
          "DataCollector.collectData: Не удалось определить маршрут заявки!",
          credTypeName
        );
    }
  };
}

exports.DataCollector = DataCollector;
