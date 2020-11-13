class AnalyzeSupport {
  constructor() {
    this.applicationState = {
      isIntegrationError: false,

      tasks: {
        taskNameFailure: "",
        startTimeTaskFailed: "",
        currentActivityState: {
          activityType: "",
          startTime: "",
          isIntermediate: "",
          stateDescription: "",
          nullStateCounter: 0,
          nullStateIndexes: [],
          intermediateStateCounter: 0,
        },
        errorActivityState: {
          currentErrorAtivityName: "Нет",
          errorStateEntryCounter: 0,
          errorActivities: [],
          rowsIndexes: [],
        },
      },
    };

    this.analyzeTasks = () => {
      let taskTable = document.getElementById("processData");
      let archTaskTable = document.getElementById("tasksArchData");
      let rowsCount;
      let tdCount;
      let tableId;
      if (taskTable) {
        console.log(`Process is active` + "\n");

        tableId = "processData";
        rowsCount = document.querySelector("#processData > tbody").children
          .length;
        tdCount = document.querySelector("#processData > tbody").children[1]
          .children.length;
      } else {
        console.log(`No active processes` + "\n");
        tableId = "tasksArchData";
        rowsCount = document.querySelector("#tasksArchData > tbody").children
          .length;
        tdCount = document.querySelector("#tasksArchData > tbody").children[1]
          .children.length;
      }
      let tds = [];
      let i = taskTable ? 1 : 1;

      for (i; i < rowsCount; i++) {
        console.log(`Analayzing tr with index: ${i}` + "\n");

        tds = document.querySelector(`#${tableId} > tbody`).children[i]
          .children;

        for (let idx = 0; idx < tdCount; idx++) {
          console.log(
            `Analayzing td with index: ${idx} and value: ${tds[idx].innerText}` +
              "\n"
          );

          if (tds[idx].innerText == "2") {
            if (rowsCount > 10 ? i <= 7 : i <= 5) {
              this.applicationState.tasks.errorActivityState.currentErrorAtivityName =
                tableId == "processData" ? tds[3].innerText : tds[2].innerText;
              this.applicationState.tasks.errorActivityState
                .errorStateEntryCounter++;
              this.applicationState.tasks.errorActivityState.rowsIndexes.push(
                i
              );
            } else {
              this.applicationState.tasks.errorActivityState.errorActivities.push(
                tableId == "processData" ? tds[3].innerText : tds[2].innerText
              );
              this.applicationState.tasks.errorActivityState
                .errorStateEntryCounter++;
              this.applicationState.tasks.errorActivityState.rowsIndexes.push(
                i
              );
            }
          }

          if (tds[idx].innerText == "0") {
            if (tableId == "processData") {
              tds[4].innerText == "intermediateConditional"
                ? (this.applicationState.tasks.currentActivityState.isIntermediate = true)
                : (this.applicationState.tasks.currentActivityState.isIntermediate = false);
              this.applicationState.tasks.currentActivityState.isIntermediate
                ? (this.applicationState.tasks.currentActivityState.stateDescription =
                    "Зависание")
                : (this.applicationState.tasks.currentActivityState.stateDescription = `Тип активности ${tds[4].innerText}`);
              this.applicationState.tasks.currentActivityState.activityType =
                tds[4].innerText;
              this.applicationState.tasks.currentActivityState
                .nullStateCounter++;
              this.applicationState.tasks.currentActivityState.nullStateIndexes.push(
                i
              );
            } else {
              tds[3].innerText == "intermediateConditional"
                ? (this.applicationState.tasks.currentActivityState.isIntermediate = true)
                : (this.applicationState.tasks.currentActivityState.isIntermediate = false);
              this.applicationState.tasks.currentActivityState.isIntermediate
                ? (this.applicationState.tasks.currentActivityState.stateDescription =
                    "Зависание")
                : (this.applicationState.tasks.currentActivityState.stateDescription = `Тип активности ${tds[3].innerText}`);
              this.applicationState.tasks.currentActivityState.activityType =
                tds[3].innerText;
              this.applicationState.tasks.currentActivityState
                .nullStateCounter++;
              this.applicationState.tasks.currentActivityState.nullStateIndexes.push(
                i
              );
            }
          }

          if (tds[idx].innerText == "1") {
            if (i == 1) {
              this.applicationState.tasks.currentActivityState.stateDescription =
                "Нет активных задач";
            }
          }

          if (tds[idx].innerText == "intermediateConditional") {
            this.applicationState.tasks.currentActivityState
              .intermediateStateCounter++;
          }
        }
      }

      console.log(`applicationState: ` + "\n");
      console.log(this.applicationState);
    };

    this.checkIntegrationLogs = () => {
      if (!document.querySelector("#integrationLogData")) {
        return;
      }

      const rowsLength = document.querySelector("#integrationLogData > tbody")
        .children.length;
      const tdsLength = document.querySelector("#integrationLogData > tbody")
        .children[1].children.length;
      let tds = [];

      for (let i = 1; i < rowsLength; i++) {
        console.log(`Analayzing integration table tr with index: ${i}` + "\n");

        tds = document.querySelector("#integrationLogData > tbody").children[i]
          .children;

        for (let idx = 0; idx < tdsLength; idx++) {
          console.log(
            `Analayzing integration table td with index: ${idx}` + "\n"
          );

          if (tds[idx].innerText && idx == 6) {
            console.log(
              `Integration error text was detected on row index: ${i}` + "\n"
            );
            this.applicationState.isIntegrationError = true;
          }
        }
      }
    };

    this.renderHTML = () => {
      let container = document.getElementById("process-stat");

      if (container) {
        container.innerHTML = this.createInformationalPanelByApplicationState();
      }
    };

    this.startAnalyze = () => {
      this.analyzeTasks();
      this.checkIntegrationLogs();
      this.renderHTML();
    };

    this.createInformationalPanelByApplicationState = () => {
      return `<div class="container-flex" id="parentDiv">
            <label class=>Сводка по BPM процессу заявки</label>
            <div class="row" id="childDiv">
                <div class="col gray-border">Текущее состояние процесса</div>
                <div class="col gray-border light-green">${
                  this.applicationState.tasks.currentActivityState
                    .stateDescription
                }</div>
                <div class="w-100"></div> 
                <div class="col gray-border">Последняя задача в ошибке</div>
                <div class="col gray-border light-green">${
                  this.applicationState.tasks.errorActivityState
                    .currentErrorAtivityName
                }</div>
                <div class="w-100"></div> 
                <div class="col gray-border">Количество зависаний заявки</div>
                <div class="col gray-border light-green">${
                  this.applicationState.tasks.currentActivityState
                    .intermediateStateCounter
                }</div>
                <div class="w-100"></div> 
                <div class="col gray-border">Количество завершенных с ошибкой задач</div>
                <div class="col gray-border light-green">${
                  this.applicationState.tasks.errorActivityState
                    .errorStateEntryCounter
                }</div>
                <div class="w-100"></div> 
                <div class="col gray-border">Имя задач(и), завершенных(ой) с ошибкой в порядке убывания</div>
                <div class="col gray-border light-green">${
                  this.applicationState.tasks.errorActivityState.errorActivities
                }</div>
                <div class="w-100"></div>
                <div class="col gray-border">Есть ли в интеграционных логах ошибка?</div>
                <div class="col gray-border light-green">${
                  this.applicationState.isIntegrationError ? "Да" : "Нет"
                }</div>    
            </div>
        </div>`;
    };
  }
}

const support = new AnalyzeSupport();

support.startAnalyze();
