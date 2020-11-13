const checkIfLogNeedToClean = (input, logType = null) => {
  console.log(`checkIfLogNeedToClean: data logType ${logType}`);

  let isNeedToClean = false;

  input.forEach((char, idx) => {
    if (logType == "Икар") {
      if (idx > 2) {
        isNeedToClean =
          input[idx - 2] + input[idx - 1] + input[idx] == "&gt"
            ? true
            : isNeedToClean;
        isNeedToClean =
          input[idx - 2] + input[idx - 1] + input[idx] == "&lt"
            ? true
            : isNeedToClean;
        return;
      }
    }

    if (logType == "СПР") {
      if (idx > 2) {
        isNeedToClean =
          input[idx - 2] + input[idx - 1] + input[idx] == "lt;"
            ? true
            : isNeedToClean;
        isNeedToClean =
          input[idx - 2] + input[idx - 1] + input[idx] == "gt;"
            ? true
            : isNeedToClean;
        isNeedToClean =
          input[idx - 2] + input[idx - 1] + input[idx] == "#39;"
            ? true
            : isNeedToClean;
        isNeedToClean =
          input[idx - 2] + input[idx - 1] + input[idx] == "#34;"
            ? true
            : isNeedToClean;
        return;
      }
      if (idx > 3) {
        isNeedToClean =
          input[idx - 4] +
            input[idx - 3] +
            input[idx - 2] +
            input[idx - 1] +
            input[idx] ==
          "lt;"
            ? true
            : isNeedToClean;
        return;
      }
    }

    return isNeedToClean;
  });
};

const cleanLogRegEx = (targetElementId, logStr, logType = null) => {
  const regex = /(\&|)lt\;/g;
  const regex2 = /(\&|)gt\;/g;
  const regex3 = /(\&|)amp\;/g;
  const regex4 = /quot\;/g;
  const regex5 = /\#13\;/g;
  const regex6 = /\#\d{2}\;/g;
  const regex7 = /<\?.*<return>/g;
  const regex8 = /<\/return.*>/g;

  let newStr = logStr
    .replace(regex, "<")
    .replace(regex2, ">")
    .replace(regex3, "")
    .replace(regex4, "'")
    .replace(regex6, "'");

  if (logType == "Икар") {
    newStr = newStr.replace(regex7, "").replace(regex8, "");
  }

  SupportPageController.callPopUp("", "Форматирование текста завершено", 3000);
  document.getElementById(targetElementId).innerText = newStr;
  document.getElementById(targetElementId).style.color = "rgb(228, 235, 244)";
  document.getElementById(targetElementId).style.backgroundColor = "#0a454f";
  document.getElementById(targetElementId).style.transition = "50000";
};

const cleanLog = (targetElementId, logStr, logType = null) => {
  let logCharArray = logStr.split("");
  let logCharArrayCopy = logCharArray;

  console.log(targetElementId);

  console.log(
    `cleanLog: data: ${
      logCharArray[0] + logCharArray[1] + logCharArray[2]
    }... ${logType}`
  );

  // if (!checkIfLogNeedToClean(logCharArray, logType)) {
  //     console.log(`cleanLog: checkIfLogNeedToClean response: ${checkIfLogNeedToClean(logCharArray, logType)}`);
  //     return;
  // }

  logCharArray.forEach((char, idx) => {
    console.log(`cleanLog: starting to clean log data`);
    if (logType == "Икар") {
      if (idx > 3) {
        switch (
          logCharArray[idx - 2] +
          logCharArray[idx - 1] +
          logCharArray[idx]
        ) {
          case "&gt":
            logCharArrayCopy.splice(idx - 2, 3, ">");
            break;
          case "&lt":
            logCharArrayCopy.splice(idx - 2, 3, "<");
            break;
          default:
            break;
        }
        switch (
          logCharArray[idx - 4] +
          logCharArray[idx - 3] +
          logCharArray[idx - 2] +
          logCharArray[idx - 1] +
          logCharArray[idx]
        ) {
          case "&amp;":
            logCharArrayCopy.splice(idx - 4, 5, "");
            break;
          case "quot;":
            logCharArrayCopy.splice(idx - 4, 5, "'");
            break;
          default:
            break;
        }
      }
    }
    if (logType == "СПР") {
      if (idx > 2) {
        if (logCharArray[idx - 2] + logCharArray[idx - 1] !== "&a") {
          switch (
            logCharArray[idx - 2] +
            logCharArray[idx - 1] +
            logCharArray[idx]
          ) {
            case "gt;":
              logCharArrayCopy.splice(idx - 2, 3, ">");
              break;
            case "lt;":
              logCharArrayCopy.splice(idx - 2, 3, "<");
              break;
            case "#39":
              logCharArrayCopy.splice(idx - 2, 3, '"');
              break;
            case "#34":
              logCharArrayCopy.splice(idx - 2, 3, '"');
              break;
            default:
              break;
          }
        }
      }
    }
  });

  if (logType == "СПР") {
    cleanLogAmp(logCharArrayCopy);
  }

  logCharArrayCopy.forEach((char, idx) => {
    if (char == ";") {
      logCharArrayCopy[idx] = "";
    }
  });

  if (logType == "Икар") {
    cleanXMLLogSpaces(logCharArrayCopy);
    logCharArrayCopy = cleanToXmlParseLog(logCharArrayCopy);
    cleanXMLLogEmptyStrings(logCharArrayCopy);
  }

  console.log(`cleanLog: end of cleaning`);

  if (targetElementId) {
    console.log(
      `cleanLog: placing string into element with id ${targetElementId}`
    );
    document.getElementById(targetElementId).innerText = logCharArrayCopy.join(
      ""
    );
    SupportPageController.callPopUp(
      "",
      "Форматирование текста завершено",
      3000
    );
    document.getElementById(targetElementId).style.color = "rgb(228, 235, 244)";
    document.getElementById(targetElementId).style.backgroundColor = "#0a454f";
    document.getElementById(targetElementId).style.transition = "50000";
  }
};

const cleanXMLLogEmptyStrings = (array) => {
  array.forEach((char, idx) => {
    if (char == "") {
      array.splice(idx, 1);
    }
  });
};

const cleanXMLLogSpaces = (array) => {
  array.forEach((char, idx) => {
    if (idx > 3) {
      if (array[idx - 1] == ">" && array[idx + 1] == "<" && array[idx] == " ") {
        array[idx] = "";
      }
    }
  });
};

const cleanLogAmp = (arr) => {
  arr.forEach((char, idx) => {
    if (idx > 4) {
      if (
        arr[idx - 4] + arr[idx - 3] + arr[idx - 2] + arr[idx - 1] + arr[idx] ==
        "&amp;"
      ) {
        arr.splice(idx - 4, 5);
      }
    }
  });
};

const getThreadBackGroundColorByAttributeValue = (attributeValue) => {
  const color = document.querySelector(`[chainid="${attributeValue}"]`)
    .children[getCellIndexByColumnName("thread_name")].style.backgroundColor;
  return color;
};

const makeHTMLChainInfoPanel = (attributeName, value, isThreadName = false) => {
  return `<span class="chain-info">
        <span class="attribute-name" style="font-weight: bold;">${attributeName}: </span>${value} </span>`;
};

const chainInfoWrapper = (HTMLtoWrap, chainName) => {
  return `<div id="${chainName}_group" class="thread-log-block" style="border-style: solid; border-color: ${getThreadBackGroundColorByAttributeValue(
    chainName
  )}">${HTMLtoWrap}</div>`;
};

const cleanToXmlParseLog = (array) => {
  let xmlEntryCounter = 0;
  let isReturnPresent = false;

  console.log(
    `cleanToXmlParseLog: starting parse xmlEntryCounter: ${xmlEntryCounter}`
  );

  array.forEach((char, idx) => {
    if (idx > 3) {
      // if (idx > 120 && idx < 140 ) {
      //     console.log(`cleanToXmlParseLog: loop index: ${idx}, char: ${char}`);
      // }
      if (
        array[idx - 4] +
          array[idx - 3] +
          array[idx - 2] +
          array[idx - 1] +
          array[idx] ==
          "<?xml" ||
        array[idx - 4] +
          array[idx - 3] +
          array[idx - 2] +
          array[idx - 1] +
          array[idx] ==
          "?xml"
      ) {
        xmlEntryCounter++;
        console.log(
          `cleanToXmlParseLog: xmlEntryCounter increased: ${xmlEntryCounter}, index: ${idx}`
        );
        if (xmlEntryCounter > 1) {
          array = array.slice(idx - 4);
        }
      }
    }
  });

  array.forEach((char, idx) => {
    //убираем из результата головной xml
    if (idx > 3) {
      if (
        array[idx - 5] +
          array[idx - 4] +
          array[idx - 3] +
          array[idx - 2] +
          array[idx - 1] +
          array[idx] ==
        "return"
      )
        isReturnPresent = true;
    }
  });
  //проверяем есть ли тэг return в логе
  if (isReturnPresent) {
    array.forEach((char, idx) => {
      //убираем из результата головной xml
      if (idx > 5) {
        if (
          array[idx - 6] +
            array[idx - 5] +
            array[idx - 4] +
            array[idx - 3] +
            array[idx - 2] +
            array[idx - 1] +
            array[idx] ==
          "/return"
        ) {
          array = array.slice(0, idx - 7);
        }
      }
    });
  }
  return array;
};

const hideLargeLogs = () => {
  //метод для скрытия тяжеловесных логов
  SupportPageController.showLoaderFlex(
    "Обработка",
    "Выполняется поиск тяжеловесных логов"
  );
  let elkTable;
  let trCoordinates = [];
  for (let table of document.getElementsByTagName("table")) {
    if (table.id == "elkData") {
      elkTable = table;
    }
  }
  if (elkTable) {
    //определяем индекс столбца с информацией о размере
    let index;
    elkTable.childNodes.forEach((child) => {
      if (child.tagName == "THEAD") {
        child.childNodes.forEach((trChild) => {
          if (trChild.tagName == "TR") {
            trChild.childNodes.forEach((thChild) => {
              if (
                thChild.tagName == "TH" &&
                thChild.innerText == "message_size"
              ) {
                index = thChild.cellIndex;
              }
            });
          }
        });
      }
    });
    for (let child of elkTable.children) {
      if (child.tagName == "TBODY") {
        for (let tr of child.children) {
          for (let td of tr.children) {
            if (td.cellIndex == index) {
              if (parseInt(td.innerText, 10) > 9718) {
                trCoordinates.push(tr.rowIndex);
                tr.style.backgroundColor = "#1e3d46";
                td.firstChild.color = "#e3743e";
              }
            }
          }
        }
      }
    }

    for (let child of elkTable.children) {
      if (child.tagName == "TBODY") {
        for (let tr of child.children) {
          if (trCoordinates.length > 0) {
            trCoordinates.forEach((coordinate, idx) => {
              if (tr.rowIndex == coordinate) {
                for (let tdChild of tr.children[index - 1].children) {
                  //tdChild.style.display = 'none';
                  //скорректирован способ отображения
                  if (tdChild.classList.contains("longtext2-unwrapped")) {
                    tdChild.classList.remove("longtext2-unwrapped");
                    tdChild.classList.add("longtext2");
                    tdChild.previousElementSibling.innerHTML = `<path d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59A1,1,0,0,0,17,9.17Z"></path>`;
                  } else if (tdChild.classList.contains("longtext2")) {
                    tdChild.classList.remove("longtext2");
                    tdChild.classList.add("longtext2-unwrapped");
                    tdChild.previousElementSibling.innerHTML = `<path d="M17,13.41,12.71,9.17a1,1,0,0,0-1.42,0L7.05,13.41a1,1,0,0,0,0,1.42,1,1,0,0,0,1.41,0L12,11.29l3.54,3.54a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29A1,1,0,0,0,17,13.41Z"></path>`;
                  }
                }
              }
            });
            if (tr.rowIndex == child.children.length) {
              setTimeout(() => {
                SupportPageController.closeLoaderFlex();
                SupportPageController.callPopUp(
                  "",
                  "Обработка завершена",
                  3000
                );
              }, 2000);
            }
          } else {
            SupportPageController.callPopUp(
              "",
              "Тяжеловесных логов не найдено",
              3000
            );
            SupportPageController.closeLoaderFlex();
          }
        }
      }
    }
  } else {
    SupportPageController.callPopUp(
      "",
      "Не найдено таблицы логов ELK",
      3000,
      "#511919"
    );
  }
};

const getParametersFromLogs = (logString) => {
  const regExpForParams = /\w*\=.[^\,]*\,/g;
  const regExpForChainUIDFind = /chainRequestId\=.[^\,]+[^\,]/g;
  const regExpForClassNameFind = /defaultClassIdFieldName\=.[^\,]+[^\,]/g;

  const getArrayOfParamsByLog = (text) => {
    const parametersList = text.match(regExpForParams);
    if (parametersList.length > 0) {
      return parametersList.map((param) => param.replace(",", ""));
    } else return [];
  };

  const getChainUIDByLog = (text) => {
    const chainUIDsList = text.match(regExpForChainUIDFind);
    if (chainUIDsList.length > 0) {
      return chainUIDsList.map((chainUID) => chainUID.replace(",", ""));
    } else return [];
  };

  const getClassNamesByLog = (text) => {
    const classNamesList = text.match(regExpForClassNameFind);
    if (classNamesList.length > 0) {
      return classNamesList.map((className) => className.replace(",", ""));
    } else return [];
  };
};

const getCellIndexByColumnName = (columnName) => {
  let ths = document.getElementById("elkData").children[0].children[0].children;
  for (let th of ths) {
    if (th.innerText == columnName) {
      return th.cellIndex;
    }
  }
};

const getRowWithErrorLevel = () => {
  const levelIndex = getCellIndexByColumnName("level");
};

const analyzeErrorsByELKLogs = () => {
  const regTempOffsetFailesInTopic = /Failed record's offset.\d{1,15}/g;
  const regTempTS = /ts.\d{1,4}.\d{1,2}.\d{1,2}\w\d{1,2}.\d{1,2}.\d{1,2}.\d{1,4}/g;
  const regSourceFailedMessage = /sourceInstanceId\=\w*.{1,14}/g;
  const regChainReqId = /chainRequestId\=.{36}/g;
  const regMessageReqId = /messageId\=.{36}/g;
  const regReqClassName = /defaultClassIdFieldName\=(\w|\.)*/g;
};

let aggregateDataCallsCounter = 0;

const detectEqualThreadLogs = () => {
  //вывод однопоточных логов сервиса
  //предпологается, что таблица с ID elkData уже существует в DOM

  const getMatchedRowIndexesByCellIndexes = (
    columnNames = [],
    cellIndex,
    cellIndex2
  ) => {
    let matchedRowIndexes = [];
    let chainId = "";
    //получаем все дочерние tr таблицы elkData
    let trs = document.getElementById("elkData").getElementsByTagName("tr");
    for (let tr of trs) {
      if (tr.rowIndex > 0) {
        let currentColor = "";
        chainId = tr.hasAttribute("chainid")
          ? tr.getAttribute("chainid")
          : `${tr.rowIndex}_chain`;
        tr.setAttribute("chainid", chainId);
        let val1 = tr.children[cellIndex].innerText;
        let val2 = tr.children[cellIndex2].innerText;
        tr.children[cellIndex2].style.display = "table-cell";
        tr.children[cellIndex2].style.maxHeight = "180px";
        tr.children[cellIndex2].style.maxWidth = "300px";
        tr.children[cellIndex2].style.width = "max-content";
        if (window.location.href.split("/")[3] == "support") {
          tr.children[
            cellIndex2
          ].innerHTML = `<a style="word-break: break-word" href="http://localhost:3000/support/${
            document.getElementById("appNum").innerText
          }#${tr.getAttribute(
            "chainid"
          )}_group" style="color: #c4ecec">${val2}</a>`;
        } else {
          tr.children[
            cellIndex2
          ].innerHTML = `<a style="word-break: break-word" href="http://localhost:3000/kibana#${tr.getAttribute(
            "chainid"
          )}_group" style="color: #c4ecec">${val2}</a>`;
        }
        for (let trNested of trs) {
          if (tr.rowIndex != trNested.rowIndex) {
            if (
              val1 == trNested.children[cellIndex].innerText &&
              val2 == trNested.children[cellIndex2].innerText
            ) {
              if (!trNested.hasAttribute("chainid")) {
                trNested.setAttribute("chainid", chainId);
              }
              currentColor = currentColor
                ? currentColor
                : generateRandomColorCode();
              matchedRowIndexes.push(tr.rowIndex, trNested.rowIndex);
              if (
                tr.children[cellIndex2].style.backgroundColor != currentColor
              ) {
                tr.children[cellIndex2].style.backgroundColor = currentColor;
              }
              trNested.children[
                cellIndex2
              ].style.backgroundColor = currentColor;
              // console.log(`getMatchedRowIndexesByCellIndexes: matchedRowIndexes: `);
              // console.log(matchedRowIndexes);
            }
          }
        }
      }
    }
  };

  const enrichELKTableWithSurroundThreadLogsButton = () => {
    let trs = document.getElementById("elkData").getElementsByTagName("tr");
    for (let tr of trs) {
      if (tr.rowIndex > 0) {
        tr.innerHTML += `<div class="additional-load-thread" style="display: table-cell"><span id="getIncThreadLogs" style="font-weight: bold; font-size: 70px; color: #3bd8f2" onclick="getAdditionalThreadLogs(this.parentNode.parentNode, 'increment')" onmouseover="SupportPageController.handlePopUpPermanent('show', this, event, 'Подгрузить ближайшие логи для данного потока в шагу поиска (мс)')"
          onmouseleave="SupportPageController.handlePopUpPermanent('close')">+</span><span id="getDecThreadLogs" style="font-weight: bold; font-size: 70px; color: #930b17" onclick="getAdditionalThreadLogs(this.parentNode.parentNode, 'decrement')" onmouseover="SupportPageController.handlePopUpPermanent('show', this, event, 'Подгрузить ближайшие логи данного потока по шагу поиска (мс), предшествующие по времени')"
          onmouseleave="SupportPageController.handlePopUpPermanent('close')"> -</span>`;
      }
    }
  };

  const generateRandomColorCode = () => {
    return (
      "#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
    );
  };

  const cellIdx = getCellIndexByColumnName("app_name");
  const cellIdx2 = getCellIndexByColumnName("thread_name");

  getMatchedRowIndexesByCellIndexes(
    ["app_name", "thread_name"],
    cellIdx,
    cellIdx2
  );

  const getFoundChainsCounter = () => {
    let chains = [];
    let allTrsWithChainAttributes = document.querySelectorAll("[chainid]");
    if (allTrsWithChainAttributes.length > 0) {
      allTrsWithChainAttributes.forEach((tr) => {
        let counter = 0;
        let currentTrRowIndex = tr.rowIndex;
        allTrsWithChainAttributes.forEach((trNested, idx) => {
          if (
            currentTrRowIndex != trNested.rowIndex &&
            tr.getAttribute("chainid") == trNested.getAttribute("chainid") &&
            currentTrRowIndex < trNested.rowIndex
          ) {
            counter++;
            if (idx == allTrsWithChainAttributes.length - 1) {
              chains.push({
                chainId: tr.getAttribute("chainid"),
                counter,
              });
            }
          } else {
            if (idx == allTrsWithChainAttributes.length - 1) {
              chains.push({
                chainId: tr.getAttribute("chainid"),
                counter,
              });
            }
          }
        });
      });
    }
    return chains;
  };

  const getFoundChainsCounterSimple = () => {
    let chains = [];
    let objList = [];
    let allTrsWithChainAttributes = document.querySelectorAll("[chainid]");
    if (allTrsWithChainAttributes.length > 0) {
      allTrsWithChainAttributes.forEach((tr, idx) => {
        objList.push({
          chainName: tr.getAttribute("chainid"),
          chainsCounter: document.querySelectorAll(
            `[chainid="${tr.getAttribute("chainid")}"]`
          ).length,
        });
      });
    }
    return objList;
  };

  const aggregateChainLogsData = () => {
    if (aggregateDataCallsCounter > 0) {
      document.getElementById("chainWrapperContent").innerHTML = "";
    }
    const messageCellIdx = getCellIndexByColumnName("message");
    const appNameCellIdx = getCellIndexByColumnName("app_name");
    const chains = getFoundChainsCounterSimple();
    console.log(`detectEqualThreadLogs.aggregateChainLogsData: chains: `);
    console.log(chains);
    if (chains.length > 0) {
      let foundChainsCounter = 0;
      document.getElementById("chainWrapper").style.width = "max-content";
      document.getElementById("chainWrapper").style.height = "max-content";
      document.getElementById("chainWrapper").style.maxHeight = "700px";
      chains.forEach((chain, idx) => {
        if (idx > 0) {
          let chainsRest = chains.slice(idx + 1);
          let checkDuplictateIdx = chainsRest.findIndex(
            (c) => c.chainName == chain.chainName
          );
          if (checkDuplictateIdx == -1) {
            foundChainsCounter++;
            const logsChainVar = document.querySelectorAll(
              `[chainid="${chain.chainName}"]`
            )[0].children[appNameCellIdx].innerText;
            const timeChain = document.querySelector(
              `[chainid="${chain.chainName}"]`
            ).children[getCellIndexByColumnName("@timestamp")].lastElementChild
              .innerText;
            const correlationId = getParameterByAttributeValue(
              chain.chainName,
              "correlation"
            );
            const topic = getParameterByAttributeValue(
              chain.chainName,
              "topic"
            );
            const receivedPartition = getParameterByAttributeValue(
              chain.chainName,
              "partition"
            );
            const offset = getParameterByAttributeValue(
              chain.chainName,
              "offset"
            );
            const messageId = getParameterByAttributeValue(
              chain.chainName,
              "message"
            );
            const sourceInstanceId = getParameterByAttributeValue(
              chain.chainName,
              "source"
            );

            document.getElementById(
              "chainWrapperContent"
            ).innerHTML += `<span style="margin-left: 15px; font-size: 30px; color: #219fff">Поток #${foundChainsCounter}: </span><br>==============================<br>`;
            document.getElementById("chainWrapperContent").innerHTML +=
              chainInfoWrapper(
                `${makeHTMLChainInfoPanel(
                  "Имя потока",
                  document.querySelector(`[chainid="${chain.chainName}"]`)
                    .children[getCellIndexByColumnName("thread_name")]
                    .innerText,
                  true
                )}<br>${makeHTMLChainInfoPanel(
                  "Время записи",
                  timeChain
                )}<br>${makeHTMLChainInfoPanel(
                  "Поток логов сервиса",
                  logsChainVar
                )}` +
                  `${makeHTMLChainInfoPanel(
                    "Количество логов в потоке",
                    chain.chainsCounter
                  )}` +
                  `<br>` +
                  makeHTMLChainInfoPanel(
                    "Ключ цепочечного запроса",
                    getParameterByAttributeValue(chain.chainName, "chain")
                      .length > 0
                      ? getParameterByAttributeValue(chain.chainName, "chain")
                      : "Не найден"
                  ) +
                  `<br>` +
                  makeHTMLChainInfoPanel(
                    "Ключ межсервисного сообщения",
                    messageId && messageId.length > 0 ? messageId : "Не найден"
                  ) +
                  `<br>` +
                  makeHTMLChainInfoPanel(
                    "Ключ корреляции (ответа с запросом)",
                    correlationId && correlationId.length > 0
                      ? correlationId
                      : "Не найден"
                  ) +
                  `<br>` +
                  makeHTMLChainInfoPanel(
                    "Источник сообщения",
                    sourceInstanceId && sourceInstanceId.length > 0
                      ? sourceInstanceId
                      : "Не найден"
                  ) +
                  `<br>` +
                  makeHTMLChainInfoPanel(
                    "Название топика",
                    topic && topic.length > 0 ? topic : "Не найден"
                  ) +
                  makeHTMLChainInfoPanel(
                    "Номер партиции",
                    receivedPartition && receivedPartition.length > 0
                      ? receivedPartition
                      : "Не найден"
                  ) +
                  makeHTMLChainInfoPanel(
                    "Значение смещения (offset)",
                    offset && offset.length > 0 ? offset : "Не найден"
                  ) +
                  `<br>` +
                  makeHTMLChainInfoPanel(
                    "Класс сообщения",
                    getParameterByAttributeValue(chain.chainName, "class")
                      .length > 0
                      ? getParameterByAttributeValue(chain.chainName, "class")
                      : "Не найден",
                    chain.chainName
                  ),
                chain.chainName
              ) +
              `<button id="${chain.chainName}" onclick="hideTrByAttributeValue(this.id)">Скрыть/Показать</button><br><br>`;
          }
        }
      });
      if (aggregateDataCallsCounter == 0) {
        document.getElementById(
          "elkButtonsContainer"
        ).innerHTML += `<a href="#chainWrapperContent">Список потоков</a>`;
        enrichELKTableWithSurroundThreadLogsButton();
      }
      aggregateDataCallsCounter++;
    }
  };

  console.log(`found chains: `);
  console.log(getFoundChainsCounterSimple());
  aggregateChainLogsData();
};

const hideTrByAttributeValue = (attributeValue) => {
  //скрывает группу однопоточных логов
  let nodeListByAttrValue = document.querySelectorAll(
    `[chainid="${attributeValue}"]`
  );
  nodeListByAttrValue.forEach((node) => {
    node.style.display = node.style.display == "none" ? "table-row" : "none";
  });
  if (!document.getElementById("excludeLogsWithoutKeyCheckBox").checked) {
    const logGroup = document.getElementById(`${attributeValue}_group`);
    logGroup.style.display =
      logGroup.style.display == "none" ? "block" : "none";
  }
};

const getParameterByAttributeValue = (attributeValue, parameterName = null) => {
  const messageCellIndex = getCellIndexByColumnName("message");
  let result = [];
  let regExpTarget;
  let textTarget;
  if (parameterName) {
    switch (parameterName) {
      case "chain":
        regExpTarget = /chainRequestId\=.{36}/;
        textTarget = "chainRequestId";
        break;
      case "class":
        regExpTarget = /defaultClassIdFieldName\=(\w|\.)*/;
        textTarget = "defaultClassIdFieldName";
        break;
      case "message":
        regExpTarget = /messageId\=.{36}/g;
        textTarget = "messageId";
        break;
      case "correlation":
        regExpTarget = /correlationId\=(\w|\-)*/g;
        textTarget = "correlationId";
        break;
      case "topic":
        regExpTarget = /topic\=(\w|\_)*/g;
        textTarget = "topic";
        break;
      case "partition":
        regExpTarget = /receivedPartition\=\d{1,2}/g;
        textTarget = "receivedPartition";
        break;
      case "offset":
        regExpTarget = /offset\=\d*/g;
        textTarget = "offset";
        break;
      case "source":
        regExpTarget = /sourceInstanceId\=(\w|\:|\-)*/g;
        textTarget = "sourceInstanceId";
        break;
    }
  }

  let nodeListByAttrValue = document.querySelectorAll(
    `[chainid="${attributeValue}"]`
  );
  if (nodeListByAttrValue.length > 0) {
    nodeListByAttrValue.forEach((node) => {
      for (let childNode of node.children) {
        if (childNode.cellIndex == messageCellIndex) {
          for (let content of childNode.children) {
            if (content.tagName == "P" && content.id) {
              if (content.innerText.includes(textTarget)) {
                result = content.innerText.match(regExpTarget);
              }
            }
          }
        }
      }
    });
    return result;
  } else return [];
};

const getRequestClassNameByAttributeValue = (attributeValue) => {
  const messageCellIndex = getCellIndexByColumnName("message");
  let result = [];
  const regDefaultClassIdFieldName = /defaultClassIdFieldName\=(\w|\.)*/;
};

const getAdditionalDataFromChainLogs = () => {
  const messageCellIndex = getCellIndexByColumnName("message");
  let trs = document.getElementById("elkData").getElementsByTagName("tr");
  for (let tr of trs) {
    for (let child of trs.children) {
      if (child.tagName == "P" && child.id) {
        let message = child.innerHTML;
        if (message.includes("chainId") || message.includes("chainRequestId")) {
          let regExpChainUID = /chainRequestId\=.{36}/;
        }
      }
    }
  }
};

const getAdditionalThreadLogs = async (trNodeInitiator, key = "") => {
  //функция для получения дополнительных логов связанных с потоком выбранного сервиса
  console.log(
    `getAdditionalThreadLogs has been called with key: ${key}, initiator: `
  );
  console.log(trNodeInitiator);
  const prepareCloneNode = (cloneNode) => {
    if (cloneNode) {
      for (let i = 0; i < cloneNode.children.length; i++) {
        for (let tdChild of cloneNode.children[i].children) {
          if (tdChild.id) {
            tdChild.id += "_add";
          }
        }
      }
    }
  };
  const renderHTMLContent = (elkResponse, trNodeInit) => {
    if (elkResponse.length > 0) {
      if (key == "increment") {
        elkResponse.reverse();
      }
      let tempCloneNode = trNodeInit.cloneNode(true);
      let prevCloneNode;
      prepareCloneNode(tempCloneNode);
      elkResponse.forEach((log, index) => {
        if (index > 0) {
          prevCloneNode = tempCloneNode;
          tempCloneNode = tempCloneNode.cloneNode(true);
          prepareCloneNode(tempCloneNode);
        }
        for (let td of tempCloneNode.children) {
          if (td.cellIndex == 0) {
            for (let tdChild of td.children) {
              if (tdChild.tagName == "P") {
                tdChild.innerText =
                  log["@timestamp"].split("T")[0] +
                  " " +
                  log["@timestamp"].split("T")[1].split("+")[0];
              }
            }
          }
        }
        for (let key in log) {
          switch (key) {
            case "app_instance":
              tempCloneNode.children[
                getCellIndexByColumnName(key)
              ].children[0].innerText = log[key];
              break;
            case "app_name":
              tempCloneNode.children[
                getCellIndexByColumnName(key)
              ].children[0].innerText = log[key];
              break;
            case "level":
              tempCloneNode.children[
                getCellIndexByColumnName(key)
              ].children[0].innerText = log[key];
              break;
            case "logger_name":
              tempCloneNode.children[
                getCellIndexByColumnName(key)
              ].children[0].innerText = log[key];
              break;
            case "thread_name":
              tempCloneNode.children[
                getCellIndexByColumnName(key)
              ].children[0].innerText = log[key];
              break;
            case "message":
              for (let tdChild of tempCloneNode.children[
                getCellIndexByColumnName(key)
              ].children) {
                if (tdChild.id && tdChild.id.includes("_long_")) {
                  tdChild.innerText = log[key];
                }
              }
              break;
            case "message_size":
              tempCloneNode.children[
                getCellIndexByColumnName(key)
              ].children[0].innerText = log[key];
              tempCloneNode.children[
                getCellIndexByColumnName(key)
              ].children[0].href = `https://kibana.test-stand.tst.int.***.ru/app/discover#/context/9e905f70-b88e-11ea-ad80-af2592106d05/${log["_id"]}?_a=(columns:!(app_name,level,message,thread_name),filters:!())&_g=(filters:!())`;
              break;
            default:
              break;
          }
        }
        tempCloneNode.style.backgroundColor = "#4c5d6f";
        if (key == "increment") {
          index == 0
            ? trNodeInit.parentNode.insertBefore(tempCloneNode, trNodeInit)
            : trNodeInit.parentNode.insertBefore(tempCloneNode, prevCloneNode);
        } else {
          index == 0
            ? trNodeInit.parentNode.insertBefore(
                tempCloneNode,
                trNodeInit.nextSibling
              )
            : trNodeInit.parentNode.insertBefore(
                tempCloneNode,
                prevCloneNode.nextSibling
              );
        }
      });
    }
  };
  const collectDataAndPrepareRequest = () => {
    let requestAdditionalThreadLogsObject = {
      mainParameters: ["", "", "", "", ""],
      fieldNames: ["app_name", "thread_name"],
      fieldValues: [],
      operators: ["AND"],
      excludeFieldNames: [],
      excludes: [],
    };
    const appNameCellIdx = getCellIndexByColumnName("app_name");
    const threadNameCellIdx = getCellIndexByColumnName("thread_name");
    let dateTimeStartThreadLog = new Date(
      trNodeInitiator.children[0].lastElementChild.innerText
    ).toISOString();
    const offsetMS = document.getElementById("offsetValue").value;
    dateTimeStartThreadLog = SupportPageController.modifyDateTimeByLocal(
      dateTimeStartThreadLog,
      key
    );
    let dateTimeToThreadLogs = SupportPageController.timeOffsetMSAuto(
      dateTimeStartThreadLog,
      key,
      offsetMS
    );
    const appName = trNodeInitiator.children[appNameCellIdx].innerText;
    const threadName = trNodeInitiator.children[threadNameCellIdx].innerText;
    requestAdditionalThreadLogsObject.mainParameters[2] =
      key == "increment" ? dateTimeStartThreadLog : dateTimeToThreadLogs;
    requestAdditionalThreadLogsObject.mainParameters[3] =
      key == "increment" ? dateTimeToThreadLogs : dateTimeStartThreadLog;
    requestAdditionalThreadLogsObject.fieldValues.push(appName, threadName);
    if (document.getElementById("excludeAuditLogs").checked) {
      //исключаем логи аудита
      requestAdditionalThreadLogsObject.excludeFieldNames.push("logger_name");
      requestAdditionalThreadLogsObject.excludes.push("ru.gpb.audit.events");
    }
    console.log(
      `getAdditionalThreadLogs.collectDataAndPrepareRequest: request object: `
    );
    // console.log(requestAdditionalThreadLogsObject);
    return requestAdditionalThreadLogsObject;
  };
  if (key) {
    SupportPageController.showLoaderFlex(
      "Запрос в ELK",
      "Получение дополнительных логов"
    );
    const reqObj = collectDataAndPrepareRequest();
    try {
      let response = await SupportPageController.getELKlogsOpt(
        reqObj,
        false,
        true
      );
      console.log(
        `getAdditionalThreadLogs.collectDataAndPrepareRequest: response`
      );
      console.log(response);
      renderHTMLContent(response, trNodeInitiator);
      SupportPageController.closeLoaderFlex();
      SupportPageController.callPopUp(
        "",
        `Логи подгружены, найдено: ${response.length}`,
        2000
      );
    } catch (e) {
      console.error(e);
      SupportPageController.closeLoaderFlex();
      SupportPageController.callPopUp(
        "Ошибка",
        "При загрузке дополнительных логов произошла ошибка",
        3000,
        "red"
      );
    }
  }
};

const getThreadLogsWithKeys = (threadLogsCollection) => {
  for (let div of threadLogsCollection) {
    for (let child of div.children) {
      if (child.tagName == "SPAN") {
        if (
          (child.lastChild.data &&
            child.lastChild.data.includes("chainRequestId")) ||
          (child.lastChild.data &&
            child.lastChild.data.includes("messageId")) ||
          (child.lastChild.data &&
            child.lastChild.data.includes("correlationId"))
        ) {
          div.setAttribute("key", true);
        }
      }
    }
  }
};

const hideThreadLogsByParameterName = (logsCollection, parameterName, flag) => {
  for (let childElement of logsCollection) {
    if (childElement.hasAttribute(parameterName)) {
      childElement.style.display = flag ? "block" : "none";
      if (parameterName == "key") {
        hideTrByAttributeValue(
          childElement.id.split("_")[0] + "_" + childElement.id.split("_")[1]
        );
      }
    } else {
      childElement.style.display = flag ? "none" : "block";
    }
  }
};

const getLogsWithError = (trs, flag) => {
  const levelIdx = getCellIndexByColumnName("level");
  for (let tr of trs) {
    if (tr.children[levelIdx].innerText == "ERROR") {
      tr.setAttribute("hasError", flag);
    }
  }
};

const navigationThreadLogsHandler = (requestType = "", flag = false) => {
  console.log(
    `navigationThreadLogsHandler: requestType: ${requestType}, flag: ${flag}`
  );
  const threadLogsCollection = document
    .getElementById("chainWrapperContent")
    .getElementsByTagName("div");
  //получение tr потомков tbody таблицы
  const trs = document.getElementById("elkData").children[1].children;
  if (threadLogsCollection.length == 0) {
    SupportPageController.callPopUp(
      "Ошибка",
      "Нельзя выполнять фильтрацию, пока не построены логи потоков",
      3000,
      "#511919"
    );
    return null;
  }
  switch (requestType) {
    case "key":
      getThreadLogsWithKeys(threadLogsCollection);
      hideThreadLogsByParameterName(threadLogsCollection, requestType, flag);
      break;
    case "error":
      getLogsWithError(trs, flag);
      hideThreadLogsByParameterName(trs, "hasError", flag);
      break;
    default:
      break;
  }
};

const wrapUnwrapAllMessagesByWords = () => {
  const messageCellIndex = getCellIndexByColumnName("message");
  const trs = document.getElementById("elkData").children[1];
  for (let tr of trs.children) {
    for (let tdChild of tr.children[messageCellIndex].children) {
      if (tdChild.classList.contains("longtext2-unwrapped")) {
        tdChild.classList.remove("longtext2-unwrapped");
        tdChild.classList.add("longtext2");
        tdChild.previousElementSibling.innerHTML = `<path d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59A1,1,0,0,0,17,9.17Z"></path>`;
      } else if (tdChild.classList.contains("longtext2")) {
        tdChild.classList.remove("longtext2");
        tdChild.classList.add("longtext2-unwrapped");
        tdChild.previousElementSibling.innerHTML = `<path d="M17,13.41,12.71,9.17a1,1,0,0,0-1.42,0L7.05,13.41a1,1,0,0,0,0,1.42,1,1,0,0,0,1.41,0L12,11.29l3.54,3.54a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29A1,1,0,0,0,17,13.41Z"></path>`;
      }
    }
  }
};

const wrapTargetMessage = (element) => {
  //console.log(element);
  const id = element.nextElementSibling.id;
  const messageContainer = document.getElementById(id);
  if (messageContainer.classList.contains("longtext2-unwrapped")) {
    messageContainer.classList.remove("longtext2-unwrapped");
    messageContainer.classList.add("longtext2");
    element.innerHTML = `<path d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59A1,1,0,0,0,17,9.17Z"></path>`;
  } else {
    //раскрытие текста
    messageContainer.classList.remove("longtext2");
    messageContainer.classList.add("longtext2-unwrapped");
    element.innerHTML = `<path d="M17,13.41,12.71,9.17a1,1,0,0,0-1.42,0L7.05,13.41a1,1,0,0,0,0,1.42,1,1,0,0,0,1.41,0L12,11.29l3.54,3.54a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29A1,1,0,0,0,17,13.41Z"></path>`;
  }
};

const shiftFixedBlock = (element) => {
  let isShifted = false;
  const positionClassNames = ["position-b150px-r10px", "position-b43-r442px"];
  const shiftClassNames = ["shift-fixed-bottom", "shift-fixed-right"];
  positionClassNames.forEach((position, idx) => {
    if (element.classList.contains(position)) {
      element.classList.remove(position);
      element.classList.add(shiftClassNames[idx]);
      isShifted = true;
    }
  });
  if (!isShifted) {
    shiftClassNames.forEach((shift, idx) => {
      if (element.classList.contains(shift)) {
        element.classList.remove(shift);
        element.classList.add(positionClassNames[idx]);
      }
    });
  }
};
