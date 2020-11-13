function hideReqResp(e) {
  const idTarget = e.target.id.split("_")[0] + "_long";
  console.log(`idTarget: ${idTarget}`);
  const elem = document.getElementById(idTarget);
  elem.style.display === "block" ? (elem.style.display = "none") : (elem.style.display = "block");
}

function hideReqResp2(e) {
  const idTarget = e.target.id.split("_")[0] + "_long_2";
  console.log(`idTarget: ${idTarget}, e_target_id: ${e.target.id}`);
  const elem = document.getElementById(idTarget);
  elem.style.display === "block" ? (elem.style.display = "none") : (elem.style.display = "block");
}

function hideReqResp2_1(e) {
  const idTarget = e.target.id.split("_")[0] + "_long_2_1";
  console.log(`idTarget: ${idTarget}, e_target_id: ${e.target.id}`);
  const elem = document.getElementById(idTarget);
  elem.style.display === "block" ? (elem.style.display = "none") : (elem.style.display = "block");
}

function hideReqResp3(e) {
  const idTarget = e.target.id.split("_")[0] + "_long_3";
  console.log(`idTarget: ${idTarget}`);
  const elem = document.getElementById(idTarget);
  elem.style.display === "block" ? (elem.style.display = "none") : (elem.style.display = "block");
}

function hideReqResp3_1(e) {
  const idTarget = e.target.id.split("_")[0] + "_long_3_1";
  console.log(`idTarget: ${idTarget}, e_target_id: ${e.target.id}`);
  const elem = document.getElementById(idTarget);
  elem.style.display === "block" ? (elem.style.display = "none") : (elem.style.display = "block");
}

function hideElement(elementID) {
  const elem = document.getElementById(elementID);
  elem.style.display === "block" ? (elem.style.display = "none") : (elem.style.display = "block");
}

function showLongtext(className) {
  const elem = document.getElementsByClassName(className);
  for (let i = 0; i < elem.length; i++) {
    elem[i].style.display === "block"
      ? (elem[i].style.display = "none")
      : (elem[i].style.display = "block");
  }
}

const showHideLongtextMessageByClassName = className => {
  const ps = document.getElementsByClassName(className);
  for (let i = 0; i < ps.length; i++) {
    if (ps[i].style.overflow == "hidden") {
      ps[i].style.overflow = "visible";
      ps[i].style.wordWrap = "break-word";
      ps[i].style.whiteSpace = "revert";
      ps[i].style.wordBreak = "break-word";
    } else {
      ps[i].style.overflow = "hidden";
      ps[i].style.wordWrap = "unset";
      ps[i].style.whiteSpace = "nowrap";
      ps[i].style.wordBreak = "unset";
    }
  }
};

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

SupportPageActions = {
  prettyXMLText: text => {
    if (text) {
      let arrayTextSeparated = text.split(";");
      arrayTextSeparated.forEach((textPart, idx) => {
        if (textPart == "&amp") {
          arrayTextSeparated[idx] = "";
        }
        if (textPart == "gt" || textPart == "&gt") {
          arrayTextSeparated[idx] = ">";
        }
        if (textPart == "lt" || textPart == "&lt") {
          arrayTextSeparated[idx] = "<";
        }
        if (textPart == "#39") {
          arrayTextSeparated[idx] = '"';
        }
        if (textPart == "#13") {
          arrayTextSeparated[idx] = "\n";
        }
        if (textPart == "#34") {
          arrayTextSeparated[idx] = '"';
        }
      });
      return arrayTextSeparated
        .join("")
        .split("&amp")
        .join("");
    }
  },

  putTextInTargetElementId: (text, elementId) => {
    const idx = elementId.split("_")[0];
    if (
      document.getElementById(`${idx}_long`).style.display !== "none" &&
      document.getElementById(`${idx}_long`).innerText
    ) {
      //удаляем кнопку форматирования
      document
        .getElementById(`${idx}_btn_pretty`)
        .parentNode.removeChild(document.getElementById(`${idx}_btn_pretty`));
      document.getElementById(`${idx}_long`).innerText = SupportPageActions.prettyXMLText(text);
      SupportPageController.callPopUp(
        "Процесс выполнения",
        "Форматирование текста завершено",
        3000
      );
    } else
      SupportPageController.callPopUp(
        "Ошибка",
        "Для форматирования раскройте лог!",
        5000,
        "#511919"
      );
  },

  searchChildElementsWithContentByInitialElement: eventEmitterNode => {
    let elementWithContentId;
    let childNodes = eventEmitterNode.parentNode.childNodes;
    childNodes.forEach(child => {
      if (child.tagName == "P" && child.id) {
        elementWithContentId = child.id;
      }
    });
    return elementWithContentId;
  },

  copyTextToClipBoardFromElementById: eventEmitterNode => {
    let targetId = SupportPageActions.searchChildElementsWithContentByInitialElement(
      eventEmitterNode
    );
    if (targetId) {
      let tempContainer = document.createElement("textarea");
      tempContainer.value = document.getElementById(targetId).innerText;
      document.body.appendChild(tempContainer);
      try {
        tempContainer.select();
        let isSuccess = document.execCommand("copy");
        if (isSuccess) {
          SupportPageController.callPopUp("Текст скопирован в буфер", "", 3000, "cyan");
          document.body.removeChild(tempContainer);
        } else {
          SupportPageController.callPopUp("Текст НЕ был скопирован в буфер", "", 3000, "cyan");
          document.body.removeChild(tempContainer);
        }
      } catch (e) {
        throw e;
        SupportPageController.callPopUp(
          "Возникла ошибка при копировании текста",
          "",
          3000,
          "#511919"
        );
      }
    }
  }
};

SupportPageController = {
  htmlModal: `<div class="modal-parent dimmer-modal" id="modalElement">
      <div class="modal-large">
        <span class="modal-label">Adminkey</span>
        <p>Adminkey приложение для агрегации данных из БД микросервисов РКК 2.0 для целей оперативного технического сопровождения. </p>
        <button class="modal-btn" id="btnModal" onclick="SupportPageController.closeModal()">Закрыть</button>
      </div>
    </div>`,

  makeLargeModal: (label, text) => {
    return `<div class="modal-parent dimmer-modal" id="modalElement">
               <div class="modal-large-wide" style="word-wrap: break-word;">
                <span class="modal-label">${label}</span><br>
                <p style="color: white; font-size: 25px;">${text}</p>
                <button class="modal-btn-large" id="btnModal" onclick="SupportPageController.closeModal()">Закрыть</button>
               </div>
              </div>`;
  },

  makeLargeModalForLogs: (label, text) => {
    return `<div class="modal-parent dimmer-modal" id="modalElement">
             <div class="modal-xlarge-wide" style="word-wrap: break-word;">
             <span onclick="SupportPageController.closeModal()" class="close-modal">&#10005;</span>
              <span class="modal-label">${label}</span><br>
              <p style="color: white; font-size: 30px; font-family: courier;">${text}</p>
             </div>
            </div>`;
  },

  hideElementByKey: (nodeInit, key = null) => {
    if (key == "elk_single_hide") {
      nodeInit.parentNode.lastElementChild.style.display === "block"
        ? (nodeInit.parentNode.lastElementChild.style.display = "none")
        : (nodeInit.parentNode.lastElementChild.style.display = "block");
    }
  },

  makeLargeModalFullLog: (fieldNames, fieldValues) => {
    let innerSpan = ``;
    fieldNames.forEach((fieldName, i) => {
      if ((fieldName == "stackTrace" || fieldName == "Текст ошибки") && fieldValues[i]) {
        innerSpan += `<span class="modal-field">${fieldName}: <span class="stack-trace-text">${fieldValues[i]}</span></span><br>`;
      } else if (fieldValues[i]) {
        innerSpan += `<span class="modal-field">${fieldName}: <span class="modal-field-value">${fieldValues[i]}</span></span><br>`;
      }
    });

    return `<div class="modal-parent dimmer-modal" id="modalElement">
           <div class="modal-xlarge-wide-full" style="word-wrap: break-word;">
           <span onclick="SupportPageController.closeModal()" class="close-modal">&#10005;</span>
           <span class="modal-label">Log Information</span><br><br>
            ${innerSpan}
           </div>
          </div>`;
  },

  showModal: modalHTML => {
    const divTarget = document.getElementById("modalContainer");
    divTarget.innerHTML = modalHTML;
    //document.body.insertBefore(div, divTarget);
  },

  closeModal: () => {
    const modal = document.getElementById("modalContainer");
    modal.innerHTML = ``;
    document.body.style.overflow = "auto";
  },

  callModal: (label, text, isTechnical = false) => {
    let modalHTML = ``;
    if (isTechnical) {
      document.body.style.overflow = "hidden";
      modalHTML = SupportPageController.makeLargeModalForLogs(label, text);
      SupportPageController.showModal(modalHTML);
    } else {
      document.body.style.overflow = "hidden";
      modalHTML = SupportPageController.makeLargeModal(label, text);
      SupportPageController.showModal(modalHTML);
    }
  },

  callModalTable: elementId => {
    if (elementId.split("_")[1] == "textRead") {
      let targetContentId = `${elementId.split("_")[0]}_long_${elementId.split("_")[2]}`;
      SupportPageController.callModal(
        "log info",
        document.getElementById(targetContentId).innerHTML,
        true
      );
    }

    if (elementId.split("_")[1] == "IntTextRead") {
      let targetContentId = `${elementId.split("_")[0]}_long`;
      SupportPageController.callModal(
        "log info",
        document.getElementById(targetContentId).innerHTML,
        true
      );
    }
  },

  callModalTableFullInfo: elementNode => {
    //row index
    let idx = elementNode.parentNode.parentNode.rowIndex;

    if (elementNode.id.split("_")[1] == "fullTextRead") {
      let fieldNames = [];
      let fieldValues = [];

      const ths = document.querySelector("#elkData > thead:nth-child(1) > tr:nth-child(1)")
        .children;
      const trs = document.querySelector("#elkData > tbody:nth-child(2)").children;
      const tds = document.querySelector(`#elkData > tbody:nth-child(2)`).children[idx - 1]
        .children;

      for (let th of ths) {
        if (th) {
          fieldNames.push(th.innerText);
        }
      }

      for (let td of tds) {
        if (td.children.length <= 3) {
          td.childNodes.forEach(child => {
            if (child.tagName == "P") {
              fieldValues.push(child.innerText);
            }
          });
        } else {
          td.childNodes.forEach(child => {
            if (child.tagName == "P" && child.id) {
              fieldValues.push(child.innerText);
            }
          });
        }
      }

      let modalHTML = SupportPageController.makeLargeModalFullLog(fieldNames, fieldValues);
      document.body.style.overflow = "hidden";
      SupportPageController.showModal(modalHTML);
    } else if (elementId.split("_")[1] == "fullIntTextRead") {
      let thChilds = document.querySelector("#integrationLogData > tbody > tr:nth-child(1)")
        .childNodes;
      let tdChilds = document.querySelector("#integrationLogData > tbody").children[idx + 1]
        .children;

      let fieldNames = [];
      let fieldValues = [];

      thChilds.forEach((child, i) => {
        if (i > 1 && child.localName == "th") {
          fieldNames.push(child.innerText);
        }
      });

      for (let td of tdChilds) {
        if (td.cellIndex == 7) {
          fieldValues.push(td.lastElementChild.innerHTML);
        } else if (td.cellIndex > 0) {
          fieldValues.push(td.innerText);
        }
      }

      let modalHTML = SupportPageController.makeLargeModalFullLog(fieldNames, fieldValues);
      document.body.style.overflow = "hidden";
      SupportPageController.showModal(modalHTML);
    }
  },

  showLoaderFlex: (headText = "", bodyText) => {
    if (bodyText) {
      const spinner = SupportPageController.makeSpinner(headText, bodyText);
      if (!document.getElementById("div-temp-spinner")) {
        let tempContainer = document.body.appendChild(document.createElement("div"));
        tempContainer.id = "div-temp-spinner";
        tempContainer.innerHTML = spinner;
      } else {
        document.getElementById("div-temp-spinner").innerHTML = spinner;
      }
    }
  },

  closeLoaderFlex: () => {
    if (document.getElementById("div-temp-spinner")) {
      document.getElementById("div-temp-spinner").innerHTML = ``;
    }
  },

  showLoader: (placeId, spinnerHTML) => {
    if (placeId && spinnerHTML) {
      const loaderHolder = document.getElementById(placeId);
      loaderHolder.innerHTML = spinnerHTML;
    }
  },

  closeLoader: targetId => {
    if (targetId) {
      const loaderHolder = document.getElementById(targetId);
      loaderHolder.innerHTML = ``;
    }
  },

  BPMRequest: async (isAnalyze = false) => {
    console.log(`BPMRequest: isAnalyze: ${isAnalyze}` + "\n");
    let appnum;
    if (window.location.href.split("/")[4].length > 10) {
      appnum = window.location.href.split("/")[4].split("#")[0];
    } else {
      appnum = window.location.href.split("/")[4];
    }
    document.removeEventListener("mousemove", this.BPMRequest);
    SupportPageController.showLoaderBPM("mainBPMdataContainer");
    let appStatus = !isAnalyze
      ? document.getElementById("appStatusSearch").innerText == "Ошибка"
        ? "ERR"
        : "notERR"
      : "notERR";
    console.log(`BPMRequest: appStatus: ${appStatus}` + "\n");
    let urlBPM = `http://localhost:3000/frontrequest/bpmdata/${appnum}/${appStatus}`;
    // if (appStatus === 'Ошибка') {
    //   appStatus = 'ERR';
    // } else {
    //   appStatus = 'notERR';
    // }
    result = await fetch(urlBPM, {
      method: "GET",
      credentials: "include"
    });
    await result;
    if (result.redirected) {
      window.location.href = result.url;
    } else {
      html = await result.text();
      const parser = new DOMParser();
      doc = parser.parseFromString(html, "text/html");
      const headerBlock = doc.getElementById("headerBlock").innerHTML;
      const bpmDataContainer = doc.getElementById("bpmDataContainer").innerHTML;
      const errorContainer = doc.getElementById("errorContainer").innerHTML;
      document.getElementById("errorContainer").innerHTML = errorContainer;
      document.getElementById("headWithBPMdata").innerHTML = headerBlock;
      document.getElementById("mainBPMdataContainer").innerHTML = bpmDataContainer;
      SupportPageController.callPopUp("Данные из BPM получены", ``, 2000);
      setTimeout(() => {
        SupportPageController.callPopUp(
          "Загрузка завершена",
          `Для дополнительного поиска логов можно воспользоваться панелью поиска логов в ELK (Kibana)`,
          5000,
          "rgb(44,82,46)"
        );
      }, 3000);
      setTimeout(() => {
        SupportPageController.markBorderByElementIdWithInterval(
          "searchElkLogsPanel",
          "rgb(0, 255, 28)"
        );
      }, 7000);
      if (!isAnalyze) {
        SupportPageController.loadAnalyzeJS();
      }
      document.getElementById("getBPMBtn").style.display = "none";
      if (document.getElementById("analyze")) {
        document.getElementById("analyze").id = "analyze-true";
      }
    }
  },

  reloadMainJS: () => {
    console.log(`reloadMainJS: reloading main script` + "\n");

    if (document.getElementById("mainScript")) {
      let oldSrc = document.getElementById("mainScript");

      if (oldSrc.parentNode) {
        let parent = oldSrc.parentNode;
        parent.removeChild(oldSrc);
        let newScript = document.createElement("script");
        newScript.id = "mainScript";
        newScript.src = "/public/js/8441_support-script-object.js";
        document.body.appendChild(newScript);
      }
    } else {
      let src = document.createElement("script");
      src.id = "mainScript";
      src.src = "/public/js/8441_support-script-object.js";
      document.body.appendChild(src);
    }
  },
  reloadUtilsJS: () => {
    console.log(`reloadUtilsJS: reloading utils script` + "\n");

    if (document.getElementById("mainScriptUtils2")) {
      let oldSrc = document.getElementById("mainScriptUtils2");

      if (oldSrc.parentNode) {
        let parent = oldSrc.parentNode;
        parent.removeChild(oldSrc);
        let newScript = document.createElement("script");
        newScript.id = "mainScriptUtils2";
        newScript.src = "/public/js/8441_support-log-formatter-utils.js";
        document.body.appendChild(newScript);
      }
    } else {
      let src = document.createElement("script");
      src.id = "mainScriptUtils2";
      src.src = "/public/js/8441_support-log-formatter-utils.js";
      document.body.appendChild(src);
    }
  },

  // reloadKibanaJS: () => {
  //
  //     console.log(`reloadKibanaJS: reloading kibana scripts`+'\n');
  //
  //     let src = document.createElement('script');
  //     src.id = 'kibanaScript';
  //     src.src = '/public/js/8441_kibana-utils.js';
  //     document.body.appendChild(src);
  // },

  loadAnalyzeJS: (caller = false) => {
    if (caller) {
      caller.parentNode.removeChild(caller);
    }

    console.log(`loadAnalyzeJS: loading analyze script` + "\n");

    if (document.getElementById("analyzeScript")) {
      let oldSrc = document.getElementById("analyzeScript");

      if (oldSrc.parentNode) {
        let parent = oldSrc.parentNode;
        parent.removeChild(oldSrc);
        let newScript = document.createElement("script");
        newScript.id = "analyzeScript";
        newScript.src = "/public/js/8441_support-analyze.js";
        document.body.appendChild(newScript);
      }
    } else {
      let src = document.createElement("script");
      src.id = "analyzeScript";
      src.src = "/public/js/8441_support-analyze.js";
      document.body.appendChild(src);
    }
  },

  loadKibanaValidatorScript: (callerId = false) => {
    if (callerId) {
      document.getElementById("control-panel").style.display = "block";
      document.getElementById(callerId).parentNode.removeChild(document.getElementById(callerId));
    }

    console.log(`loadKibanaValidatorScript: loading ELK page search scripts` + "\n");

    let src = document.createElement("script");
    src.id = "kibana-script";
    src.src = "/public/js/8441_support-kibana-validators.js";
    document.body.appendChild(src);
  },

  preProcessELKRequest: (
    isFromMain = false,
    isAnalyze = false,
    {
      mainParameters = [],
      fieldNames = [],
      fieldValues = [],
      operators = [],
      excludeFieldNames,
      excludes
    } = {}
  ) => {
    const requestObject = {
      mainParameters,
      fieldNames,
      fieldValues,
      operators,
      excludeFieldNames,
      excludes
    };
  },

  dateTimeInputValidator: (
    isFromMain = false,
    isAnalyze = false,
    { fieldNames = [], fieldValues = [], operators = [] } = {}
  ) => {
    if (document.querySelector("#start").value && document.querySelector("#end").value) {
      if (isFromMain) {
        try {
          SupportPageController.getELKlogs(
            document.querySelector("#start").value,
            document.querySelector("#end").value,
            document.querySelector("#additional").value,
            document.querySelector("#additional2").value,
            document.querySelector("#additional3").value,
            fieldNames,
            fieldValues,
            operators,
            isFromMain,
            isAnalyze
          );
        } catch (e) {
          throw e;
        }
      } else {
        try {
          SupportPageController.getELKlogs(
            document.querySelector("#start").value,
            document.querySelector("#end").value,
            document.querySelector("#additional").value,
            document.querySelector("#additional2").value,
            document.querySelector("#additional3").value,
            fieldNames,
            fieldValues,
            operators,
            isFromMain,
            isAnalyze
          );
        } catch (e) {
          throw e;
        }
      }
    } else {
      SupportPageController.callPopUp(
        "Ошибка",
        `Необходимо задать период поиска логов!`,
        5000,
        "#511919"
      );
      //alert(`Необходимо задать период!`);
    }
  },

  elkSearchHandler: async () => {
    await SupportPageController.getELKlogs(
      document.querySelector("#start").value,
      document.querySelector("#end").value,
      document.querySelector("#additional").value,
      document.querySelector("#additional2").value
    );
  },

  dateTimeInputBlocker: () => {
    if (document.querySelector("#start").value && document.querySelector("#end").value) {
      document.querySelector("#getELKlogsWithRange").disabled = false;
    } else {
      document.querySelector("#getELKlogsWithRange").disabled = true;
    }
  },

  markBorderByElementIdWithInterval: (elementId, color) => {
    const markElementInt = setInterval(() => {
      document.getElementById(elementId).style.borderStyle = "solid";
      document.getElementById(elementId).style.borderWidth = "5px";
      document.getElementById(elementId).style.borderColor = color;
      setTimeout(() => {
        document.getElementById(elementId).style.borderStyle = "none";
        document.getElementById(elementId).style.borderWidth = "5px";
      }, 2000);
    }, 1000);
    // const deMarkElementInt = setInterval(() => {
    //     document.getElementById(elementId).style.borderStyle = 'none';
    //     document.getElementById(elementId).style.borderWidth = '5px';
    // }, 1500);
    setTimeout(() => {
      clearInterval(markElementInt);
      // clearInterval(deMarkElementInt);
      document.getElementById(elementId).style.borderStyle = "none";
      document.getElementById(elementId).style.borderWidth = "5px";
    }, 15000);
  },

  getELKlogsOpt: async (requestObj = {}, isAnalyze = false, additionalFlag = false) => {
    if (!additionalFlag) {
      SupportPageController.showLoaderFlex("Запрос в ELK", "Получение данных из хранилища логов");
    }
    console.log(`Request for ELK search with params:` + "\n");
    requestObj = { ...requestObj, isOpt: true, isAdditional: additionalFlag };
    console.log(requestObj);
    const urlELK = `http://localhost:3000/elksearch`;
    const result = await fetch(urlELK, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(requestObj)
    });

    if (result.ok) {
      await result;

      if (result.redirected) {
        window.location.href = result.url;
      } else {
        if (!additionalFlag) {
          let response = await result.text();
          //console.log(response);
          const parser = new DOMParser();
          let doc = parser.parseFromString(response, "text/html");
          document.getElementById("elk-block-container").innerHTML = doc.getElementById(
            "part-container"
          ).innerHTML;
          // SupportPageController.reloadUtilsJS();
          SupportPageController.closeLoaderFlex();
          let counter = document.querySelector("#elkData").rows.length;
          if (window.location.href.includes("#")) {
            window.location.href = window.location.href;
          } else {
            window.location.href = window.location + "#elkContainer";
          }
          SupportPageController.callPopUp(
            "Загрузка завершена",
            `Всего загружено ${counter > 1 ? counter - 1 : counter} логов`,
            3000
          );
          aggregateDataCallsCounter = 0;
          setTimeout(() => {
            SupportPageController.callPopUp(
              "Загрузка завершена",
              `Для поиска доп.логов отметьте однопоточные логи`,
              5000,
              "chartreuse"
            );
          }, 3000);
          setTimeout(() => {
            SupportPageController.markBorderByElementIdWithInterval(
              "btnMarkSingleThreadLogs",
              "rgb(0, 255, 28)"
            );
          }, 7000);
          if (isAnalyze) {
            setTimeout(() => {
              //SupportPageController.reloadMainJS();
            }, 1000);
          }
        } else {
          let response = await result.json();
          console.log(`getELKlogsOpt: got additionalFlag response`);
          console.log(response);
          return response;
        }
      }
    } else {
      SupportPageController.closeLoaderFlex();
      SupportPageController.callPopUp(
        "Ошибка",
        `Сетевая ошибка при получении логов , 
            статус ответа: ${result.status}`,
        10000,
        "#511919"
      );
      aggregateDataCallsCounter = 0;
    }
  },

  getELKlogs: async (
    start = 0,
    end = 0,
    additional = null,
    additional2 = null,
    additional3 = null,
    fieldNames = [],
    fieldValues = [],
    operators = [],
    isFromMain = false,
    isAnalyze = false
  ) => {
    if (document.getElementById("getELKlogs")) {
      document.getElementById("getELKlogs").removeEventListener("click", this.getELKlogs);
      document.getElementById("getELKlogs").style.display = "none";
    }
    SupportPageController.showLoaderFlex("Запрос в ELK", "Получение данных из хранилища логов");
    let params = [];
    console.log(document.getElementById("elk-search-params").innerHTML);
    params = document.getElementById("elk-search-params").innerHTML.split(",");
    if (start && end) {
      console.log(`Period: from ${start} to ${end}`);
      try {
        start = new Date(start).toISOString();
        end = new Date(end).toISOString();
        params[2] = start;
        params[3] = end;
      } catch (e) {
        SupportPageController.closeLoaderFlex();
        SupportPageController.callPopUp(
          "Ошибка",
          `При преобразовании даты произошла ошибка: ${e}`,
          7000,
          "#511919"
        );
        throw new Error(e);
      }
    }

    if (isFromMain) {
      params[0] = additional ? additional : additional2 ? additional2 : additional3;
      params[1] = additional2 ? additional2 : additional ? additional : additional3;
      params[4] = additional3 ? additional3 : additional2 ? additional2 : additional;
    } else {
      let removed = [];
      let paramsCopy = params;
      let idx = 0;

      console.log(`Params before started splicing: ` + "\n");
      console.log(paramsCopy);

      params.forEach((param, i) => {
        if (i > 3) {
          if (params[0] == param) {
            idx == 0
              ? console.log(`First found index of ${i}`)
              : console.log(`Other found index of ${i}`);
            idx == 0 ? (idx = i) : idx;
            console.log(`Removing element ${param} by index: ${i}`);
            removed += paramsCopy.splice(i, 1);
            if (idx != 0) {
              if (params[0] == params[idx]) {
                removed += paramsCopy.splice(idx, 1);
              }
            }
          } else {
            idx != 0 ? (idx = i + 1) : idx;
          }
        }
      });

      params = paramsCopy;
      console.log(`Params after splicing: ` + "\n");
      console.log(paramsCopy);
      console.log(`Removed elements: ` + "\n");
      console.log(removed);

      if (additional) {
        params.push(additional);
      }
      if (additional2) {
        params.push(additional2);
      }
      if (additional3) {
        params.push(additional3);
      }
    }

    let parameters = {};
    params.forEach((param, i) => {
      parameters = { ...parameters, ["parameter" + i]: param };
    });

    parameters.fieldNames = fieldNames;
    parameters.fieldValues = fieldValues;
    parameters.operators = operators;

    parameters = { ...parameters, isOpt: false };

    console.log(`Request for ELK search with params:` + "\n");
    console.log(parameters);
    const urlELK = `http://localhost:3000/elksearch`;
    const result = await fetch(urlELK, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json;charset=utf-8"
      },
      body: JSON.stringify(parameters)
    });

    if (result.ok) {
      await result;

      if (result.redirected) {
        window.location.href = result.url;
      } else {
        let response = await result.text();
        //console.log(response);
        const parser = new DOMParser();
        let doc = parser.parseFromString(response, "text/html");
        document.getElementById("elk-block-container").innerHTML = doc.getElementById(
          "part-container"
        ).innerHTML;
        SupportPageController.closeLoaderFlex();
        let counter = document.querySelector("#elkData").rows.length;
        SupportPageController.callPopUp(
          "Загрузка завершена",
          `Всего загружено ${counter > 1 ? counter - 1 : counter} логов`,
          3000
        );
        aggregateDataCallsCounter = 0;
        if (window.location.href.includes("#")) {
          if (window.location.href.includes("#elkContainer")) {
            window.location.href = window.location.href;
          } else {
            window.location.href = window.location.href.split("#")[0] + "#";
          }
        } else {
          window.location.href = window.location + "#elkContainer";
        }
        setTimeout(() => {
          SupportPageController.callPopUp(
            "",
            `Для поиска доп.логов отметьте однопоточные логи`,
            5000,
            "#25AAAA"
          );
        }, 3000);
        setTimeout(() => {
          SupportPageController.markBorderByElementIdWithInterval(
            "btnMarkSingleThreadLogs",
            "rgb(0, 255, 28)"
          );
        }, 4000);
        // SupportPageController.reloadKibanaJS();
        if (!isAnalyze) {
          setTimeout(() => {
            //SupportPageController.reloadMainJS();
          }, 1000);
        }
      }
    } else {
      aggregateDataCallsCounter = 0;
      SupportPageController.closeLoaderFlex();
      SupportPageController.callPopUp(
        "Ошибка",
        `Сетевая ошибка при получении логов , статус ответа: ${result.status}`,
        7000,
        "#511919"
      );
    }
  },

  retryTaskBPM: async () => {
    let processInstanceId = "cec62f6c-dd48-11ea-ae1e-0242ac110002";

    let requestBody = {
      id: `${processInstanceId}`,
      modifications: { retryTask: { value: true, type: "Boolean" } }
    };

    try {
      let result = await fetch(
        `https://test.app.rcl.int.***.ru/camunda/api/engine/engine/default/execution/${processInstanceId}/localVariables`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json;charset=utf-8",
            Authorization: "Basic ZGVtbzpnZmxpYnEhMXhmcXlicg=="
          },
          body: JSON.stringify(parameters)
        }
      );
      await result;
      if (result.ok) {
        alert(`Ретрай заявки выполнен`);
      } else {
        alert(`Ответ с ошибкой, статус ответа: ${result.status}`);
      }
    } catch (e) {
      alert(`Ответ с ошибкой: ${e}`);
      console.error(e);
    }
  },

  fillTimeRangeFields: () => {
    let hangStartTime = document.querySelector(
      "#processData > tbody > tr:nth-child(2) > td:nth-child(8)"
    ).innerHTML;

    hangStartTime = hangStartTime.split(".")[0].replace(" ", "T");

    let StartHang = SupportPageController.timeOffsetMinutes(hangStartTime, 6, "decrement").split(
      "."
    )[0];
    let EndHang = SupportPageController.timeOffsetMinutes(hangStartTime, 2, "increment").split(
      "."
    )[0];

    document.querySelector("#start").value = StartHang;
    document.querySelector("#end").value = EndHang;

    checkDateFields("start");
    checkDateFields("end");

    document.getElementById("getELKlogsWithRange").disabled = false;
    document.getElementById("getELKlogsWithRange").style.cursor = "pointer";
  },

  timeOffsetMinutes: (dateTime, minutes, key) => {
    dateTime = new Date(dateTime);
    dateTime =
      key == "increment"
        ? dateTime.setMinutes(dateTime.getMinutes() + minutes)
        : dateTime.setMinutes(dateTime.getMinutes() - minutes);
    console.log(`timeOffsetMinutes: ${key} result date: ${new Date(dateTime).toISOString()}`);
    return new Date(dateTime).addHours(3).toISOString();
  },

  timeOffsetMSAuto: (dateTime, key, ms = "10") => {
    let msParsed = parseInt(ms, 10);
    dateTime = new Date(dateTime);
    dateTime =
      key == "increment"
        ? dateTime.setMilliseconds(dateTime.getMilliseconds() + msParsed)
        : dateTime.setMilliseconds(dateTime.getMilliseconds() - msParsed);
    console.log(`timeOffsetMSAuto: ${key} result date: ${new Date(dateTime).toISOString()}`);
    return new Date(dateTime).toISOString();
  },

  modifyDateTimeByLocal: (dateTimeStr, key = null) => {
    dateTimeStr = new Date(dateTimeStr);
    if (key == "increment") {
      dateTimeStr = dateTimeStr.setMilliseconds(dateTimeStr.getMilliseconds() + 1);
    } else {
      dateTimeStr = dateTimeStr.setMilliseconds(dateTimeStr.getMilliseconds() - 1);
    }
    return new Date(dateTimeStr).toISOString();
  },

  showInfoPanel: emitter => {},

  spinnerMain: `<div class="dimmer">
    <div class='container'>
      <div class='loader'>
        <font size="5px">Ожидание выполнения: получение данных по заявке...</font>
        <font size="3px">Просьба не перезагружать страницу это увеличит время сбора данных</font>
        <div class='spinner-simple'>
        </div>
      </div>
    </div>
  </div>`,

  spinnerBPM: `<div class="dimmer-bpm-loader">
    <div class='container'>
      <div class='loader-bpm'>
        <font size="5px">Ожидание выполнения: Получение данных BPM процесса...</font>
        <font size="3px">Сбор данных о процессе в среднем занимает около 2-5 секунд</font>
        <div class='spinner-simple'>
        </div>
      </div>
    </div>
  </div>`,

  makeSpinner: (text1, text2) => {
    return `<div class="dimmer-bpm-loader">
    <div class='container'>
      <div class='loader-bpm'>
        <font size="5px">Ожидание выполнения: ${text1}...</font><br>
        <font size="3px">${text2}</font>
        <div class='spinner-simple'>
        </div>
      </div>
    </div>
  </div>`;
  },

  showLoaderBPM: id => {
    if (id) {
      const loaderHolder = document.getElementById(id);
      loaderHolder.innerHTML = SupportPageController.spinnerBPM;
    }
  },

  callPopUp: (title, text, ms, color = null) => {
    const popUpHTML = SupportPageController.makePopUp(title, text, color);
    SupportPageController.showPopUp(popUpHTML, ms);
  },

  handlePopUpPermanent: (
    eventName = null,
    nodeInitiator = null,
    event = null,
    title = "",
    text = ""
  ) => {
    if (eventName == "show") {
      //получение координат мыши
      console.log(`event: `);
      console.log(event);
      const coordX = event.clientX;
      const coordY = event.clientY;
      const targetX = coordX - 350 < 0 ? 0 : coordX - 350;
      const targetY = coordY - 250 < 0 ? 0 : coordY - 250;
      const rect = nodeInitiator.getBoundingClientRect();
      const popUpHTML = SupportPageController.makePopUpPermanent(title, text);
      SupportPageController.showPopUpPermanent(popUpHTML, targetY, targetX);
    } else {
      SupportPageController.closePermanentPopup();
    }
  },

  showPopUpPermanent: (popUpHTML, coordY, coordX) => {
    let tempContainer = ``;
    if (!document.getElementById("div-temp-perm")) {
      let divCont;
      for (let child of document.body.children) {
        if (child.tagName == "DIV") {
          divCont = child;
        }
      }
      tempContainer = document.body.appendChild(document.createElement("div"));
      tempContainer.id = "div-temp-perm";
      tempContainer.style.position = "fixed";
      console.log(`coordY + 'px' = ${coordY + "px"}`);
      tempContainer.style.top = coordY + "px";
      tempContainer.style.left = coordX + "px";
      // tempContainer.style.height = '500px';
      // tempContainer.style.width = '1000px';
      tempContainer.innerHTML = popUpHTML;
    } else {
      console.log(`coordY + 'px' = ${coordY + "px"}`);
      document.getElementById("div-temp-perm").style.top = coordY + "px";
      document.getElementById("div-temp-perm").style.left = coordX + "px";
      document.getElementById("div-temp-perm").innerHTML = popUpHTML;
    }
  },

  closePermanentPopup: () => {
    document.getElementById("div-temp-perm").innerHTML = ``;
  },

  makePopUpPermanent: (title, text) => {
    return `<div class='container-popup-perm' style="background-color: #0c5460;">
        <div class='popup'>
          <p>${title}</p><br>
          <p>${text}
          </p>
        </div>
      </div>`;
  },

  makePopUp: (title, text, color = null) => {
    if (color) {
      return `<div class='container-popup' style="background-color: ${color}">
        <div class='popup'>
          <p>${title}</p><br>
          <p>${text}
          </p>
        </div>
      </div>`;
    } else {
      return `<div class='container-popup'>
        <div class='popup'>
          <p>${title}</p><br>
          <p>${text}
          </p>
        </div>
      </div>`;
    }
  },

  showPopUp: (popUpHTML, ms) => {
    let tempContainer = ``;

    if (!document.getElementById("div-temp")) {
      tempContainer = document.body.appendChild(document.createElement("div"));
      tempContainer.id = "div-temp";
      tempContainer.innerHTML = popUpHTML;
      setTimeout(() => {
        tempContainer.innerHTML = ``;
      }, ms);
    } else {
      document.getElementById("div-temp").innerHTML = popUpHTML;

      setTimeout(() => {
        document.getElementById("div-temp").innerHTML = ``;
      }, ms);
    }
  },

  helpText: `<p style="color: white; font-size: 30px;">Если вы пользуетесь браузером Mozilla Firefox, то для ввода дат можно просто использовать формат<br> 
  <span style="color: green;">YYYY-MM-DD HH:MM</span><br>например: <span style="color: green;">2020-08-10 16:17</span> либо <span style="color: green;">10/08/2020 16:15</span> Не подходит: <span style="color: red;">10.08.2020 16:15</span><br>Время указывается по местному часовому поясу</p><br>
    <span style="color: white; font-size: 30px;">В нижнем поле исключений допустимо писать исключения через запятую без пробелов</span><br>
    <span style="color: white; font-size: 30px;">В Полях условий (1 и 2 сверху) допустимо указывать только одно значение</span>`
};
