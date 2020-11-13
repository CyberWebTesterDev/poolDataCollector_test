const getElement = (id) => document.getElementById(id);

const stateForm = {
  start: "",
  end: "",
  mainOrCondition: "",
  mainOrCondition2: "",
  mainOrCondition3: "",
  additionalCondition: "",
  additionalCondition2: "",
  excludeParameters: {
    values: ["statusviewservice", "administrationservice", "autoassignservice"],
  },
  checkboxes: [
    {
      id: "isFieldNamePicked",
      relatedFieldId: "additionalCondition",
      relatedFieldNameId: "fieldNameSelector",
      selected: false,
    },
    {
      id: "isFieldNamePicked2",
      relatedFieldId: "additionalCondition2",
      relatedFieldNameId: "fieldNameSelector2",
      selected: false,
    },
    {
      id: "isFieldNamePicked3",
      relatedFieldId: "excludeParameters",
      relatedFieldNameId: "fieldNameSelector3",
      selected: true,
    },
  ],
  fieldNames: [
    {
      id: "fieldNameSelector",
      value: "app_name",
    },
    {
      id: "fieldNameSelector2",
      value: "thread_name",
    },
    {
      id: "fieldNameSelector3",
      value: "app_name",
    },
  ],
  logicalOperators: {
    operators: ["OR", "AND"],
    currentValue: "OR",
  },
  hiddenText: {
    id: "text2",
    styles: ["none", "table-cell"],
    visibleStyle: "none",
  },
  invalidFieldsData: [],
};

stateForm.hiddenText.visibleStyle = stateForm.hiddenText.styles[0];

// SYNCHRONIZERS

const synchronizeLogicalOperatorsSelectorsDOMwithStateForm = (elementId) => {
  console.log(`synchronizing selector ${elementId} with state`);

  const { logicalOperators } = stateForm;

  logicalOperators.currentValue = getElement(elementId).value;

  console.log(stateForm);
};

const synchronizeSelectorsDOMwithStateForm = (elementId) => {
  console.log(`synchronizing selector ${elementId} with state`);

  const { fieldNames } = stateForm;

  const idx = fieldNames.findIndex((fieldName) => fieldName.id == elementId);

  fieldNames[idx].value = getElement(elementId).value;

  console.log(stateForm);
};

const synchronizeCheckboxesDOMwithStateForm = (elementId) => {
  console.log(`synchronizing checkbox ${elementId} with state`);
  const { checkboxes } = stateForm;
  const idx = checkboxes.findIndex((checkbox) => checkbox.id == elementId);
  checkboxes[idx].selected = getElement(elementId).checked;
  console.log(stateForm);
};

const synchronizeInputDOMwithStateForm = (elementId) => {
  console.log(`synchronizing input ${elementId} with state`);

  if (elementId == "excludeParameters") {
    stateForm.excludeParameters.values = getElement(elementId).value.split(",");
  } else {
    stateForm[elementId] = getElement(elementId).value;
  }

  console.log(stateForm);
};

const synchronizeAll = () => {
  synchronizeInputDOMwithStateForm("start");
  synchronizeInputDOMwithStateForm("end");
  synchronizeInputDOMwithStateForm("mainOrCondition");
  synchronizeInputDOMwithStateForm("mainOrCondition2");
  synchronizeInputDOMwithStateForm("mainOrCondition3");
  synchronizeInputDOMwithStateForm("additionalCondition");
  synchronizeInputDOMwithStateForm("additionalCondition2");
  synchronizeInputDOMwithStateForm("excludeParameters");
  synchronizeCheckboxesDOMwithStateForm("isFieldNamePicked");
  synchronizeCheckboxesDOMwithStateForm("isFieldNamePicked2");
  synchronizeCheckboxesDOMwithStateForm("isFieldNamePicked3");
  synchronizeLogicalOperatorsSelectorsDOMwithStateForm("fieldOperatorSelector");
  synchronizeSelectorsDOMwithStateForm("fieldNameSelector");
  synchronizeSelectorsDOMwithStateForm("fieldNameSelector2");
  synchronizeSelectorsDOMwithStateForm("fieldNameSelector3");
};

//INITIALIZE

const initializeForm = () => {
  getElement("start").value = stateForm.start;
  getElement("end").value = stateForm.end;
  getElement("mainOrCondition").value = stateForm.mainOrCondition;
  getElement("mainOrCondition2").value = stateForm.mainOrCondition2;
  getElement("mainOrCondition3").value = stateForm.mainOrCondition3;
  getElement("additionalCondition").value = stateForm.additionalCondition;
  getElement("additionalCondition2").value = stateForm.additionalCondition2;
  getElement("excludeParameters").value = stateForm.excludeParameters.values;
  getElement("fieldOperatorSelector").value =
    stateForm.logicalOperators.currentValue;
  getElement(stateForm.hiddenText.id).style.display =
    stateForm.hiddenText.visibleStyle;

  stateForm.checkboxes.forEach((checkbox) => {
    getElement(checkbox.id).checked = checkbox.selected;
  });

  stateForm.fieldNames.forEach((fieldName) => {
    getElement(fieldName.id).value = fieldName.value;
  });

  console.log(stateForm);
};

initializeForm();

synchronizeAll();

const setClassRedBorderLight = (element) => {
  const { invalidFieldsData } = stateForm;

  if (!element.classList.contains("red-border")) {
    element.className += " red-border";
  }

  if (invalidFieldsData.findIndex((id) => id == element.id) == -1) {
    invalidFieldsData.push(element.id);
  }

  setVisibilityCorrectionText();
};
const removeClassRedBorderLight = (element) => {
  const { invalidFieldsData } = stateForm;

  if (element.classList.contains("red-border")) {
    element.classList.toggle("red-border");
  }

  if (invalidFieldsData.findIndex((id) => id == element.id) >= 0) {
    invalidFieldsData[invalidFieldsData.findIndex((id) => id == element.id)] =
      "";
  }

  setVisibilityCorrectionText();
};

const setVisibilityCorrectionText = () => {
  let isFormValid = true;
  const { hiddenText, invalidFieldsData } = stateForm;
  if (invalidFieldsData.length >= 1) {
    invalidFieldsData.forEach((field) => {
      if (field) {
        isFormValid = false;
      }
    });
  }

  stateForm.hiddenText.visibleStyle = isFormValid
    ? hiddenText.styles[0]
    : hiddenText.styles[1];
  getElement(hiddenText.id).style.display = hiddenText.visibleStyle;
};

const formObjectFromStateToRequest = () => {
  let mainParameters = [];
  let fieldNames = [];
  let fieldValues = [];
  let excludeFieldNames = [];
  let excludes = [];
  let operators = [];
  mainParameters.push(
    stateForm.mainOrCondition,
    stateForm.mainOrCondition2,
    new Date(stateForm.start).toISOString(),
    new Date(stateForm.end).toISOString(),
    stateForm.mainOrCondition3
  );
  operators.push(stateForm.logicalOperators.currentValue);
  if (countCheckedCheckBoxes() > 0) {
    stateForm.checkboxes.forEach((checkbox) => {
      if (checkbox.selected) {
        if (checkbox.relatedFieldId == "excludeParameters") {
          excludes = stateForm.excludeParameters.values;
          excludeFieldNames.push(getElement(checkbox.relatedFieldNameId).value);
        } else {
          fieldNames.push(getElement(checkbox.relatedFieldNameId).value);
          fieldValues.push(stateForm[checkbox.relatedFieldId]);
        }
      }
    });
  }

  return {
    mainParameters,
    fieldNames,
    fieldValues,
    operators,
    excludeFieldNames,
    excludes,
  };
};

const synchronizeTimeOpt = () => {
  if (stateForm.start) {
    getElement("end").value = stateForm.start;
    synchronizeInputDOMwithStateForm("end");
    return;
  }

  if (stateForm.end) {
    getElement("start").value = stateForm.end;
    synchronizeInputDOMwithStateForm("start");
    return;
  }

  SupportPageController.callPopUp(
    `Ошибка`,
    `Ни одно из полей времени не заполнено для синхронизации`,
    5000,
    "red"
  );
};

const shiftTimeOpt = (elementId, key) => {
  if (stateForm[elementId]) {
    let inputDateTime = stateForm[elementId];
    if (Date.parse(inputDateTime)) {
      console.log("Parsing input time");
      if (key) {
        getElement(elementId).value = SupportPageController.timeOffsetMinutes(
          inputDateTime,
          1,
          key
        ).split(".")[0];
        synchronizeInputDOMwithStateForm(elementId);
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
    getElement(elementId).value = SupportPageController.timeOffsetMinutes(
      new Date().toISOString(),
      1,
      key
    ).split(".")[0];
    synchronizeInputDOMwithStateForm(elementId);
  }
};

const cleanTimeOpt = () => {
  getElement("end").value = ``;
  getElement("start").value = ``;
  synchronizeInputDOMwithStateForm("start");
  synchronizeInputDOMwithStateForm("end");
};

//VALIDATORS

const countCheckedCheckBoxes = () => {
  let counter = 0;
  const { checkboxes } = stateForm;
  checkboxes.forEach((checkbox) => {
    if (checkbox.selected) {
      counter++;
    }
  });
  return counter;
};

const validateCheckBoxRelatedFields = () => {
  let isCheckBoxesValid = true;
  const { checkboxes } = stateForm;
  checkboxes.forEach((checkbox) => {
    if (checkbox.selected) {
      if (checkbox.relatedFieldId == "excludeParameters") {
        if (
          stateForm.excludeParameters.values.length >= 1 &&
          stateForm.excludeParameters.values[0]
        ) {
          console.log(`excludeParameters check` + "\n");
          console.log(
            `isCheckBoxesValid within loop before change: ${isCheckBoxesValid}`
          );
          isCheckBoxesValid = isCheckBoxesValid ? true : false;
          removeClassRedBorderLight(getElement(checkbox.relatedFieldId));
          console.log(
            `isCheckBoxesValid within loop after change: ${isCheckBoxesValid}`
          );
        } else {
          setClassRedBorderLight(getElement(checkbox.relatedFieldId));
          isCheckBoxesValid = false;
        }
      } else {
        console.log(
          `else condition (checkbox.relatedFieldId == 'excludeParameters')` +
            "\n"
        );
        console.log(checkbox.relatedFieldId);
        console.log(getElement(checkbox.relatedFieldId).value);
        console.log(Boolean(getElement(checkbox.relatedFieldId).value));
        console.log(
          `isCheckBoxesValid within loop before change: ${isCheckBoxesValid}`
        );
        isCheckBoxesValid = getElement(checkbox.relatedFieldId).value
          ? true
          : false;
        !isCheckBoxesValid &&
          setClassRedBorderLight(getElement(checkbox.relatedFieldId));
        isCheckBoxesValid &&
          removeClassRedBorderLight(getElement(checkbox.relatedFieldId));
        console.log(
          `isCheckBoxesValid within loop after change: ${isCheckBoxesValid}`
        );
      }
    }
  });

  console.log(
    `validateCheckBoxRelatedFields return isCheckBoxesValid: ${isCheckBoxesValid}`
  );

  return isCheckBoxesValid;
};

const validateDateFieldsForm = () => {
  let isValid;
  const { start, end } = stateForm;
  if (start && end) {
    if (Date.parse(start) && Date.parse(end)) {
      isValid = true;
    } else {
      SupportPageController.callPopUp(
        `Ошибка`,
        `Невалидный формат даты`,
        3000,
        "red"
      );
      isValid = false;
    }
  } else {
    isValid = false;
  }
  !start && setClassRedBorderLight(getElement("start"));
  start && removeClassRedBorderLight(getElement("start"));
  !end && setClassRedBorderLight(getElement("end"));
  end && removeClassRedBorderLight(getElement("end"));

  return isValid;
};

const validateKibanaSearchForm = async () => {
  const { mainOrCondition, mainOrCondition2, mainOrCondition3 } = stateForm;
  if (validateCheckBoxRelatedFields() && validateDateFieldsForm()) {
    if (countCheckedCheckBoxes() == 0) {
      stateForm.checkboxes.forEach((checkbox) => {
        removeClassRedBorderLight(getElement(checkbox.relatedFieldId));
      });
      if (mainOrCondition || mainOrCondition2 || mainOrCondition3) {
        //call ELK
        let request = formObjectFromStateToRequest();
        console.log(`result request to ELK is:` + "\n");
        console.log(request);
        try {
          await SupportPageController.getELKlogsOpt(request);
        } catch (e) {
          SupportPageController.callPopUp(
            `Ошибка`,
            `Во время обработки запроса произошла ошибка ${e}`,
            5000,
            "red"
          );
        }
      } else {
        mainOrCondition
          ? removeClassRedBorderLight(getElement("mainOrCondition"))
          : setClassRedBorderLight(getElement("mainOrCondition"));
        mainOrCondition2
          ? removeClassRedBorderLight(getElement("mainOrCondition2"))
          : setClassRedBorderLight(getElement("mainOrCondition2"));
        mainOrCondition3
          ? removeClassRedBorderLight(getElement("mainOrCondition3"))
          : setClassRedBorderLight(getElement("mainOrCondition3"));
        SupportPageController.callPopUp(
          `Ошибка`,
          `Не заполнено одно или несколько обязательных полей`,
          5000,
          "red"
        );
      }
    } else {
      try {
        let request = formObjectFromStateToRequest();
        console.log(`result request to ELK is:` + "\n");
        console.log(request);
        await SupportPageController.getELKlogsOpt(request);
      } catch (e) {
        SupportPageController.callPopUp(
          `Ошибка`,
          `Во время обработки запроса произошла ошибка ${e}`,
          5000,
          "red"
        );
      }
    }
  } else {
    SupportPageController.callPopUp(
      `Ошибка`,
      `Не заполнено одно или несколько обязательных полей`,
      5000,
      "red"
    );
  }
};
