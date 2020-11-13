const { loggerServer } = require("./logger");

exports.consumerIssueValidationCheck = (
  { appStatus, appSaleChannel, formTypeId, dateSign, issueChannel },
  statusViewData
) => {
  loggerServer(`consumerIssueValidationCheck entry with params`);
  console.log(appStatus, appSaleChannel, formTypeId, dateSign, issueChannel);

  const issueStatusesEntries = statusViewData.filter(
    (status) => status.status_name == "Выдача кредита"
  );

  const idx = statusViewData.findIndex(
    (status) => status.status_name == "Ошибка"
  );

  if (issueStatusesEntries.length > 0) {
    const errorStatusesEntries = statusViewData.filter(
      (status) => status.status_name == "Ошибка"
    );

    loggerServer(`consumerIssueValidationCheck: issue bug has been detected`);

    let contractValidDurationDays = 0;

    if (
      appSaleChannel == "719a2114-616a-43c0-8dee-f527738782fa" ||
      appSaleChannel == "a1add094-45ba-46e7-b862-0b1bca05daa8" ||
      appSaleChannel == "87c2f9f2-a420-46ba-9050-6140e4b92797" ||
      appSaleChannel == "d7901347-1c78-4f4c-b237-e5563130c7b5"
    ) {
      if (issueChannel == "МБ") {
        contractValidDurationDays = 5;
      } else {
        contractValidDurationDays = formTypeId == "Короткая" ? 3 : 5;
      }
    }

    if (appSaleChannel == "e7f7c10c-968e-4276-851d-2a1d9e6464f2") {
      contractValidDurationDays = 5;
    }

    const dateDifferenceBetweenSignAndNowMinutes = (
      Math.floor(new Date() - new Date(dateSign)) / 60000
    ).toFixed(2); //разница в минутах
    let dateDifferenceBetweenSignAndNowHours =
      dateDifferenceBetweenSignAndNowMinutes >= 60
        ? dateDifferenceBetweenSignAndNowMinutes / 60
        : 0;
    let dateDifferenceBetweenSignAndNowDays =
      dateDifferenceBetweenSignAndNowHours >= 24
        ? dateDifferenceBetweenSignAndNowHours / 24
        : 0;
    dateDifferenceBetweenSignAndNowHours = dateDifferenceBetweenSignAndNowHours.toFixed(
      1
    );
    dateDifferenceBetweenSignAndNowDays = dateDifferenceBetweenSignAndNowDays.toFixed(
      1
    );

    const dateDifferenceBetweenLastStatusAndNowMinutes = (
      Math.floor(
        new Date() -
          new Date(statusViewData[statusViewData.length - 1].start_date)
      ) / 60000
    ).toFixed(2);
    const dateDifferenceBetweenLastStatusAndNowHours = (dateDifferenceBetweenLastStatusAndNowMinutes >=
    60
      ? dateDifferenceBetweenLastStatusAndNowMinutes / 60
      : 0
    ).toFixed(2);
    const dateDifferenceBetweenLastStatusAndNowDays = (dateDifferenceBetweenLastStatusAndNowHours >=
    24
      ? dateDifferenceBetweenLastStatusAndNowHours / 24
      : 0
    ).toFixed(2);

    const additionalSupportData = {
      issueBugFlag: true,
      errorFlag: appStatus == "Ошибка" ? true : false,
      errorStatusEntryCounter:
        errorStatusesEntries.length > 0 ? errorStatusesEntries.length - 1 : 0,
      issueStatusEntryCounter: issueStatusesEntries.length - 1,
      dateDifferenceBetweenSignAndNowMinutes,
      dateDifferenceBetweenSignAndNowHours,
      dateDifferenceBetweenSignAndNowDays,
      firstIssueEntryDateTime: issueStatusesEntries[0].start_date,
      lastIIssueEntryDateTime:
        issueStatusesEntries[issueStatusesEntries.length - 1].start_date,
      firstErrorEntryDateTime:
        errorStatusesEntries.length > 0
          ? errorStatusesEntries[0].start_date
          : null,
      firstErrorTryDateTime:
        idx != -1
          ? statusViewData[idx + 1]
            ? statusViewData[idx + 1].start_date
            : null
          : null,
      lastErrorEntryDateTime:
        errorStatusesEntries.length > 0
          ? errorStatusesEntries[errorStatusesEntries.length - 1].start_date
          : null,
      isContractOutDated:
        contractValidDurationDays - dateDifferenceBetweenSignAndNowDays > 0
          ? false
          : true,
      dateDifferenceBetweenLastStatusAndNow: `${dateDifferenceBetweenLastStatusAndNowDays} дней или ${dateDifferenceBetweenLastStatusAndNowHours} часов или ${dateDifferenceBetweenLastStatusAndNowMinutes} минут`,
      employeeRetry: `${statusViewData[statusViewData.length - 2].u_fio} ${
        statusViewData[statusViewData.length - 2].u_login
      } (${statusViewData[statusViewData.length - 2].u_role})`,
      contractDateSign: dateSign,
      contractValidDurationDays,
    };

    loggerServer(
      `consumerIssueValidationCheck: returning additionalSupportData:`
    );
    console.log(additionalSupportData);

    return additionalSupportData;
  }

  if (appStatus == "Ошибка") {
    loggerServer(
      `consumerIssueValidationCheck: non issue bug has been detected`
    );

    const errorStatusesEntries = statusViewData.filter(
      (status) => status.status_name == "Ошибка"
    );

    if (errorStatusesEntries.length > 0) {
      return {
        issueBugFlag: false,
        errorFlag: true,
        errorStatusEntryCounter: errorStatusesEntries.length,
        firstErrorEntryDateTime: errorStatusesEntries[0].start_date,
        lastErrorEntryDateTime:
          errorStatusesEntries[errorStatusesEntries.length - 1].start_date,
        employeeRetry: `${statusViewData[statusViewData.length - 2].u_fio} ${
          statusViewData[statusViewData.length - 2].u_login
        } (${statusViewData[statusViewData.length - 2].u_role})`,
      };
    }
  }

  loggerServer(`consumerIssueValidationCheck: no bug has been detected`);

  return {
    issueBugFlag: false,
  };
};
