const { postHttpsRequestPromise } = require("./req-util");
const {
  makeElkReqLogJSONStr,
  options,
  makeELKrequestFlexExtended,
  makeELKrequestFlexExtendedOpt,
} = require("./elkRequestTemplate");
const { processLogsData } = require("./elkDataProcessor");

exports.elkSearchLogsAuthNeeded = async (
  params,
  fieldNames = [],
  fieldValues = [],
  operators = []
) => {
  console.log(`elkSearchLogs: Request with auth needed to ELK with params: `);
  console.log(params);

  if (fieldNames.length > 0) {
    console.log(
      `elkSearchLogs: Request contains fild and value conditions: ` + "\n"
    );
    console.log(fieldNames);
    console.log("\n");
    console.log(fieldValues);
  }

  let requestData;

  try {
    requestData = makeELKrequestFlexExtended(
      params,
      fieldNames,
      fieldValues,
      operators
    );
  } catch (e) {
    throw e;
  }

  //console.log(`elkSearchLogsAuthNeeded: requestData: `+'\n');
  //console.log(requestData);

  try {
    let result = await postHttpsRequestPromise(requestData, options);
    result = processLogsData(result);
    console.log(`elkSearchLogs: result length: ${result.length}` + "\n");
    return result;
  } catch (e) {
    //console.error(e);
    throw new Error(`Error while get ELK request ${e}`);
  }
};

exports.elkSearchLogsAuthNeededOpt = async (request = {}) => {
  console.log(
    `elkSearchLogsAuthNeededOpt: Request with auth needed to ELK with params: `
  );
  console.log(request);

  let requestData;

  try {
    requestData = makeELKrequestFlexExtendedOpt(request);
  } catch (e) {
    throw e;
  }

  //console.log(`elkSearchLogsAuthNeeded: requestData: `+'\n');
  //console.log(requestData);

  try {
    let result = await postHttpsRequestPromise(requestData, options);
    result = processLogsData(result);
    console.log(`elkSearchLogs: result length: ${result.length}` + "\n");
    return result;
  } catch (e) {
    //console.error(e);
    throw new Error(`Error while get ELK request ${e}`);
  }
};
