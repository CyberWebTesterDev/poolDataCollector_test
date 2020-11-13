const cleanTime = () => {
  document.getElementById("end").value = ``;
  document.getElementById("start").value = ``;
};

const synchronizeTime = () => {
  if (document.getElementById("start").value) {
    document.getElementById("end").value = document.getElementById(
      "start"
    ).value;
    fullCheck();
    return;
  }

  if (document.getElementById("end").value) {
    document.getElementById("start").value = document.getElementById(
      "end"
    ).value;
    fullCheck();
    return;
  }

  SupportPageController.callPopUp(
    `Ошибка`,
    `Ни одно из полей времени не заполнено для синхронизации`,
    5000,
    "red"
  );
};

const shiftTime = (elementId, key) => {
  if (document.getElementById(elementId).value) {
    let inputDateTime = document.getElementById(elementId).value;

    if (Date.parse(inputDateTime)) {
      console.log("Parsing input time");

      if (key) {
        document.getElementById(
          elementId
        ).value = SupportPageController.timeOffsetMinutes(
          inputDateTime,
          2,
          key
        ).split(".")[0];

        fullCheck();
      }
    } else {
      SupportPageController.callPopUp(
        `Ошибка`,
        `Невалидное значение времени`,
        5000,
        "red"
      );
    }
  } else {
    console.log("Putting current time");
    document.getElementById(
      elementId
    ).value = SupportPageController.timeOffsetMinutes(
      new Date().toISOString(),
      2,
      key
    ).split(".")[0];
    fullCheck();
  }
};

const checkboxChecker = () => {
  simpleCheckFields("additional");
  simpleCheckFields("additional2");
  simpleCheckFields("additional3");

  let numOfCheckBoxToCheck = 0;

  document.querySelector("#isFieldNamePicked").checked &&
  document.querySelector("#isFieldNamePicked2").checked
    ? (numOfCheckBoxToCheck = 3)
    : document.querySelector("#isFieldNamePicked").checked
    ? (numOfCheckBoxToCheck = 1)
    : document.querySelector("#isFieldNamePicked2").checked
    ? (numOfCheckBoxToCheck = 2)
    : (numOfCheckBoxToCheck = 0);

  if (numOfCheckBoxToCheck == 0) {
    removeClassRedBorder(document.querySelector("#fieldValue"), true);
    removeClassRedBorder(document.querySelector("#fieldValue2"), true);
    return 0;
  }

  if (numOfCheckBoxToCheck == 1) {
    removeClassRedBorder(document.querySelector("#fieldValue2"), true);
    return document.querySelector("#fieldNameSelector").value &&
      document.querySelector("#fieldValue").value
      ? true
      : 1;
  }

  if (numOfCheckBoxToCheck == 2) {
    removeClassRedBorder(document.querySelector("#fieldValue"), true);
    return document.querySelector("#fieldNameSelector2").value &&
      document.querySelector("#fieldValue2").value
      ? true
      : 2;
  }

  if (numOfCheckBoxToCheck == 3) {
    return document.querySelector("#fieldNameSelector2").value &&
      document.querySelector("#fieldValue2").value &&
      document.querySelector("#fieldNameSelector2").value &&
      document.querySelector("#fieldValue2").value
      ? true
      : 3;
  }
};

const fieldsCollector = () => {
  const operator = document.querySelector("#fieldOperatorSelector").value;
  const operator2 = document.querySelector("#fieldOperatorSelector2").value;
  const fieldNameSelector = document.querySelector("#fieldNameSelector").value;
  const fieldNameSelector2 = document.querySelector("#fieldNameSelector2")
    .value;
  const fieldValue = document.querySelector("#fieldValue").value;
  const fieldValue2 = document.querySelector("#fieldValue2").value;

  let fieldNames = [];
  let fieldValues = [];
  let operators = [];

  if (checkboxChecker() === true && (fieldValue || fieldValue2)) {
    const numPicker = document.querySelector("#isFieldNamePicked").checked
      ? document.querySelector("#isFieldNamePicked2").checked
        ? 3
        : 1
      : 2;

    //console.log(`numPicker: ${numPicker}`);

    if (fieldValue && fieldValue2 && numPicker == 3) {
      operators = [operator, operator2];
      fieldNames.push(fieldNameSelector, fieldNameSelector2);
      fieldValues.push(fieldValue, fieldValue2);
    } else {
      fieldNames.push(numPicker == 1 ? fieldNameSelector : fieldNameSelector2);
      fieldValues.push(numPicker == 1 ? fieldValue : fieldValue2);
      operators.push(numPicker == 1 ? operator : operator2);
    }

    return {
      fieldNames,
      fieldValues,
      operators,
    };
  } else return { fieldNames, fieldValues, operators };
};

const callChecker = () => {
  const checksResult = checkboxChecker();

  switch (checksResult) {
    case 1:
      setClassRedBorder(document.querySelector("#fieldValue"));
      document.getElementById("getELKlogsWithRange").disabled = true;
      document.getElementById("getELKlogsWithRange").style.cursor =
        "not-allowed";
      SupportPageController.callPopUp(
        `Ошибка`,
        `При взведенном чекбоксе должно быть заполнено поле`,
        5000,
        "red"
      );
      break;
    case 2:
      setClassRedBorder(document.querySelector("#fieldValue2"));
      SupportPageController.callPopUp(
        `Ошибка`,
        `При взведенном чекбоксе должно быть заполнено поле`,
        5000,
        "red"
      );
      document.getElementById("getELKlogsWithRange").disabled = true;
      document.getElementById("getELKlogsWithRange").style.cursor =
        "not-allowed";
      break;
    case 3:
      if (
        !document.querySelector("#fieldValue").value &&
        !document.querySelector("#fieldValue2").value
      ) {
        setClassRedBorder(document.querySelector("#fieldValue"));
        setClassRedBorder(document.querySelector("#fieldValue2"));
        SupportPageController.callPopUp(
          `Ошибка`,
          `При взведенных чекбоксах не заполнены поля`,
          5000,
          "red"
        );
        document.getElementById("getELKlogsWithRange").disabled = true;
        document.getElementById("getELKlogsWithRange").style.cursor =
          "not-allowed";
      } else {
        !document.querySelector("#fieldValue").value
          ? setClassRedBorder(document.querySelector("#fieldValue"))
          : setClassRedBorder(document.querySelector("#fieldValue2"));
        SupportPageController.callPopUp(
          `Ошибка`,
          `Необходимо заполнить подкрашенное поле`,
          5000,
          "red"
        );
        document.getElementById("getELKlogsWithRange").disabled = true;
        document.getElementById("getELKlogsWithRange").style.cursor =
          "not-allowed";
      }
      break;
    case 0:
      removeClassRedBorder(document.querySelector("#fieldValue"));
      removeClassRedBorder(document.querySelector("#fieldValue2"));
      document.getElementById("getELKlogsWithRange").disabled = false;
      document.getElementById("getELKlogsWithRange").style.cursor = "pointer";
      break;
  }
};

const fullCheck = () => {
  callChecker();
  simpleCheckFields("additional");
  simpleCheckFields("additional2");
  simpleCheckFields("additional3");
  checkDateFields("start");
  checkDateFields("end");
};

const middleCheckerElk = () => {
  console.log(`middleCheckerElk called` + "\n");

  console.log(
    `middleCheckerElk checkboxChecker(): ${checkboxChecker()}
    document.getElementById('supportPage'): ${Boolean(
      document.getElementById("supportPage")
    )}` + "\n"
  );

  let fieldsObject = fieldsCollector();

  let param1 = document.getElementById("additional").value
    ? document.getElementById("additional").value
    : null;
  let param2 = document.getElementById("additional2").value
    ? document.getElementById("additional2").value
    : null;
  let param3 = document.getElementById("additional3").value
    ? document.getElementById("additional3").value
    : null;
  let params = [
    param1 ? param1 : param2 ? param2 : param3,
    param2 ? param2 : param1 ? param1 : param3,
    param3 ? param3 : param2 ? param2 : param1,
  ];

  if (document.getElementById("supportPage")) {
    console.log(
      `middleCheckerElk document.getElementById('supportPage') = true` + "\n"
    );

    console.log(`middleCheckerElk: supportPage exception` + "\n");

    if (checkboxChecker() === true || checkboxChecker() == 0) {
      console.log(
        `(checkboxChecker() === true || checkboxChecker() == 0) = true` + "\n"
      );

      if (
        document.getElementById("start").value &&
        document.getElementById("end").value
      ) {
        console.log(
          `( document.getElementById('start').value && document.getElementById('end').value) = true` +
            "\n"
        );
        SupportPageController.dateTimeInputValidator(
          false,
          false,
          fieldsObject
        );
        return;
      } else {
        console.log(
          `( document.getElementById('start').value && document.getElementById('end').value) = false` +
            "\n"
        );
        SupportPageController.callPopUp(
          `Ошибка`,
          `Временной интервал должен быть указан`,
          5000,
          "red"
        );
        checkDateFields("start");
        checkDateFields("end");
        return;
      }
    }
  }

  if (checkboxChecker() === true || checkboxChecker() == 0) {
    //console.log(`middleCheckerElk document.getElementById('supportPage') = false`+'\n');

    //console.log(`middleCheckerElk checkboxChecker() === true`+'\n');

    if (
      document.getElementById("start").value &&
      document.getElementById("end").value
    ) {
      //console.log(`middleCheckerElk ( document.getElementById('start').value && document.getElementById('end').value) == true`+'\n');

      document.getElementById("elk-search-params").innerHTML = params;

      console.log("innerHTML" + "\n");
      console.log(document.getElementById("elk-search-params").innerHTML);

      checkDateFields("start");
      checkDateFields("end");

      if (
        simpleCheckFields("additional") &&
        simpleCheckFields("additional2") &&
        simpleCheckFields("additional3")
      ) {
        // console.log(`middleCheckerElk (simpleCheckFields('additional') &&
        // simpleCheckFields('additional2') &&
        // simpleCheckFields('additional3')) = true`+'\n');

        try {
          SupportPageController.dateTimeInputValidator(
            true,
            false,
            fieldsObject
          );
        } catch (e) {
          SupportPageController.callPopUp(
            `Ошибка`,
            `При выполнении запроса произошла ошибка: ${e}`,
            5000,
            "red"
          );
        }
      } else {
        SupportPageController.callPopUp(
          `Ошибка`,
          `Не заполнено одно или несколько обязательных полей`,
          5000,
          "red"
        );
      }
    } else {
      SupportPageController.callPopUp(
        `Ошибка`,
        `Не заполнено одно или несколько обязательных полей`,
        5000,
        "red"
      );

      checkDateFields("start");
      checkDateFields("end");
      simpleCheckFields("additional");
      simpleCheckFields("additional2");
      simpleCheckFields("additional3");
    }
  } else {
    callChecker();
    checkDateFields("start");
    checkDateFields("end");
    simpleCheckFields("additional");
    simpleCheckFields("additional2");
    simpleCheckFields("additional3");
  }
};

const checkDateFields = (elementId) => {
  if (document.getElementById(elementId).value) {
    if (document.getElementById(elementId).classList.contains("red-border")) {
      removeClassRedBorder(document.getElementById(elementId));
    }
  } else {
    setClassRedBorder(document.getElementById(elementId));
  }
};

const setClassRedBorder = (element, flag = false) => {
  if (flag) {
    element.className += " red-border";
    return;
  }

  if (!element.classList.contains("red-border")) {
    element.className += " red-border";
    document.getElementById("text2").style.display = "table-cell";
    document.getElementById("getELKlogsWithRange").disabled = true;
    document.getElementById("getELKlogsWithRange").style.cursor = "not-allowed";
  }
};

const removeClassRedBorder = (element, flag = false) => {
  if (element.classList.contains("red-border")) {
    element.classList.toggle("red-border");

    if (!flag) {
      document.getElementById("text2").style.display = "none";
      document.getElementById("getELKlogsWithRange").disabled = false;
      document.getElementById("getELKlogsWithRange").style.cursor = "pointer";
    }
  }
};

const simpleCheckFields = (elementId) => {
  const checkHasDocumentCheckedAnyBoxes = () => {
    if (
      document.querySelector("#isFieldNamePicked").checked ||
      document.querySelector("#isFieldNamePicked2").checked
    ) {
      return true;
    }

    return false;
  };

  const isSupportPage = document.getElementById("supportPage") ? true : false;

  let isButtonDisabled = false;
  let isCheckBoxFieldValid = false;

  if (
    elementId == "additional" &&
    !checkHasDocumentCheckedAnyBoxes() &&
    !isSupportPage
  ) {
    if (
      document.getElementById("additional2").value.length == 0 &&
      document.getElementById("additional3").value.length == 0
    ) {
      document.getElementById(elementId).value.length > 0
        ? (isButtonDisabled = false)
        : (isButtonDisabled = true);
    }
  } else if (
    elementId == "additional2" &&
    !checkHasDocumentCheckedAnyBoxes() &&
    !isSupportPage
  ) {
    if (
      document.getElementById("additional").value.length == 0 &&
      document.getElementById("additional3").value.length == 0
    ) {
      document.getElementById(elementId).value.length > 0
        ? (isButtonDisabled = false)
        : (isButtonDisabled = true);
    }
  } else if (
    elementId == "additional3" &&
    !checkHasDocumentCheckedAnyBoxes() &&
    !isSupportPage
  ) {
    if (
      document.getElementById("additional").value.length == 0 &&
      document.getElementById("additional2").value.length == 0
    ) {
      document.getElementById(elementId).value.length > 0
        ? (isButtonDisabled = false)
        : (isButtonDisabled = true);
    }
  }

  if (
    checkHasDocumentCheckedAnyBoxes() &&
    (elementId == "fieldValue" || elementId == "fieldValue2")
  ) {
    if (document.getElementById(elementId).value) {
      isCheckBoxFieldValid = true;
    }

    if (!isCheckBoxFieldValid) {
      document.getElementById("getELKlogsWithRange").disabled = true;
      document.getElementById("getELKlogsWithRange").style.cursor =
        "not-allowed";
      setClassRedBorder(document.getElementById(elementId));
    } else {
      document.getElementById("getELKlogsWithRange").disabled = false;
      document.getElementById("getELKlogsWithRange").style.cursor = "pointer";
      removeClassRedBorder(document.getElementById(elementId));
    }

    return;
  }

  if (isButtonDisabled) {
    document.getElementById("getELKlogsWithRange").disabled = true;
    document.getElementById("getELKlogsWithRange").style.cursor = "not-allowed";
    setClassRedBorder(document.getElementById("additional"));
    setClassRedBorder(document.getElementById("additional2"));
    setClassRedBorder(document.getElementById("additional3"));
    return false;
  } else {
    document.getElementById("getELKlogsWithRange").disabled = false;
    document.getElementById("getELKlogsWithRange").style.cursor = "pointer";
    removeClassRedBorder(document.getElementById("additional"));
    removeClassRedBorder(document.getElementById("additional2"));
    removeClassRedBorder(document.getElementById("additional3"));
    return true;
  }
};
