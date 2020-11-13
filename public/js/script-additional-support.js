const middleChecker = () => {
  if (document.getElementById("start").value && document.getElementById("end").value) {
    let param1 = document.getElementById("additional").value
      ? document.getElementById("additional").value
      : null;
    let param2 = document.getElementById("additional2").value
      ? document.getElementById("additional2").value
      : null;
    let param3 = document.getElementById("additional3").value
      ? document.getElementById("additional3").value
      : null;

    checkDateFields("start");
    checkDateFields("end");

    SupportPageController.dateTimeInputValidator();
  } else {
    SupportPageController.callPopUp(
      `Ошибка`,
      `Не заполнено одно или несколько обязательных полей`,
      5000,
      "red"
    );

    checkDateFields("start");
    checkDateFields("end");
  }
};

const checkDateFields = elementId => {
  if (document.getElementById(elementId).value) {
    if (document.getElementById(elementId).classList.contains("red-border")) {
      document.getElementById("getELKlogsWithRange").disabled = false;
      document.getElementById("getELKlogsWithRange").style.cursor = "cursor";

      removeClassRedBorder(document.getElementById(elementId));
    }
  } else {
    document.getElementById("getELKlogsWithRange").disabled = true;
    document.getElementById("getELKlogsWithRange").style.cursor = "not-allowed";
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
    document.getElementById("text2").style.visibility = "visible";
    //document.getElementById('getELKlogsWithRange').disabled = true;
    //document.getElementById('getELKlogsWithRange').style.cursor = 'not-allowed';
  }
};

const removeClassRedBorder = (element, flag = false) => {
  if (flag) {
    element.classList.toggle("red-border");
    document.getElementById("text2").style.visibility = "hidden";
    return;
  }

  if (element.classList.contains("red-border")) {
    element.classList.toggle("red-border");

    document.getElementById("text2").style.visibility = "hidden";

    document.getElementById("getELKlogsWithRange").disabled = false;
    document.getElementById("getELKlogsWithRange").style.cursor = "pointer";
  }
};

const simpleCheckFields = elementId => {
  let isButtonDisabled = false;

  if (elementId == "additional") {
    if (
      document.getElementById("additional2").value.length == 0 &&
      document.getElementById("additional3").value.length == 0
    ) {
      document.getElementById(elementId).value.length > 0
        ? (isButtonDisabled = false)
        : (isButtonDisabled = true);
    }
  } else if (elementId == "additional2") {
    if (
      document.getElementById("additional").value.length == 0 &&
      document.getElementById("additional3").value.length == 0
    ) {
      document.getElementById(elementId).value.length > 0
        ? (isButtonDisabled = false)
        : (isButtonDisabled = true);
    }
  } else if (elementId == "additional3") {
    if (
      document.getElementById("additional").value.length == 0 &&
      document.getElementById("additional2").value.length == 0
    ) {
      document.getElementById(elementId).value.length > 0
        ? (isButtonDisabled = false)
        : (isButtonDisabled = true);
    }
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
