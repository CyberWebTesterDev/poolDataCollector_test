exports.makeElkReqLogJSONStr = (params) => {
  return `{
        "version": true,
        "size": 500,
        "sort": [
          {
            "@timestamp": {
              "order": "desc",
              "unmapped_type": "boolean"
            }
          }
        ],
        "aggs": {
          "2": {
            "date_histogram": {
              "field": "@timestamp",
              "fixed_interval": "1s",
              "time_zone": "Europe/Moscow",
              "min_doc_count": 1
            }
          }
        },
        "stored_fields": [
          "*"
        ],
        "script_fields": {},
        "docvalue_fields": [
          {
            "field": "@timestamp",
            "format": "date_time"
          },
          {
            "field": "timestamp",
            "format": "date_time"
          }
        ],
        "_source": {
          "excludes": []
        },
        "query": {
          "bool": {
            "must": [],
            "filter": [
              {
                "match_all": {}
              },
              {
                "bool": {
                  "should": [
                    {
                      "match_phrase": {
                      "message": "${params[0]}"}
                    },
                    {
                      "match_phrase": {
                      "message": "${params[1] ? params[1] : params[0]}"}
                    
                    },
                    {
                      "match_phrase": {
                      "message": "${params[4] ? params[4] : params[0]}"}
                    
                    },
                    {
                      "match_phrase": {
                      "message": "${params[5] ? params[5] : params[0]}"}
                      
                    },
                    {
                      "match_phrase": {
                      "message": "${params[6] ? params[6] : params[0]}"}
                    
                    },
                    {
                      "match_phrase": {
                      "message": "${
                        params[7] ? params[9] : params[0]
                      }"}                  
                    },
                    {
                      "match_phrase": {
                       "message": "${
                         params[8] ? params[8] : params[0]
                       }"}                  
                    },
                    {
                      "match_phrase": {
                      "message": "${params[9] ? params[9] : params[0]}"}
                    },
                    {
                      "match_phrase": {
                      "message": "${params[10] ? params[10] : params[0]}"}
                    },
                    {
                      "match_phrase": {
                      "message": "${params[11] ? params[11] : params[0]}"} 
                    },
                    {
                      "match_phrase": {
                      "message": "${params[12] ? params[12] : params[0]}"}
                    }
                  ],
                  "minimum_should_match": 1
                }
              },
              {
                "range": {
                  "@timestamp": {
                    "gte": "${params[2]}",
                    "lte": "${params[3]}",
                    "format": "strict_date_optional_time"
                  }
                }
              }
            ],
            "should": [],
            "must_not": [
              {
                "match_phrase": {
                  "app_name": "testservice"
                }
              },
              {
                "match_phrase": {
                  "app_name": "testservice"
                }
              },
              {
                "match_phrase": {
                  "app_name": "testservice"
                }
              },
              {
                "match_phrase": {
                  "app_name": "testservice"
                }
              }
            ]
          }
        }
      }`;
};

const dataAuthElk = {
  username: "/",
  password: "/",
};

const auth = `Basic ${Buffer.from(
  dataAuthElk.username + ":" + dataAuthElk.password
).toString("base64")}`;

exports.options = {
  hostname: "***.***.***.int.***.ru",
  path: `/*/proxy?path=_search&method=GET`,
  method: `POST`,
  headers: {
    "Content-type": "application/json;charset=utf-8",
    "kbn-xsrf": "reporting",
    Authorization: auth,
  },
};

exports.makeElkReqLogJSONStrDummy = () => {
  return `{
      "version": true,
      "size": 500,
      "sort": [
        {
          "@timestamp": {
            "order": "desc",
            "unmapped_type": "boolean"
          }
        }
      ],
      "aggs": {
        "2": {
          "date_histogram": {
            "field": "@timestamp",
            "fixed_interval": "1s",
            "time_zone": "Europe/Moscow",
            "min_doc_count": 1
          }
        }
      },
      "stored_fields": [
        "*"
      ],
      "script_fields": {},
      "docvalue_fields": [
        {
          "field": "@timestamp",
          "format": "date_time"
        },
        {
          "field": "timestamp",
          "format": "date_time"
        }
      ],
      "_source": {
        "excludes": []
      },
      "query": {
        "bool": {
          "must": [],
          "filter": [
            {
              "match_all": {}
            },
            {
              "bool": {
                "should": [
                  {
                    "match_phrase": {
                      "message": "2004971323"
                    }
                  },
                  {
                    "match_phrase": {
                      "message": "427af01c-b09f-4354-be79-79a4c987ce75"
                    }
                  }
                ],
                "minimum_should_match": 1
              }
            },
            {
              "range": {
                "@timestamp": {
                  "gte": "2020-08-07T14:00:24.443Z",
                  "lte": "2020-08-07T14:02:24.443Z",
                  "format": "strict_date_optional_time"
                }
              }
            }
          ],
          "should": [],
          "must_not": [
            {
              "match_phrase": {
                "app_name": "testservice"
              }
            },
            {
              "match_phrase": {
                "app_name": "testservice"
              }
            }
          ]
        }
      }
    }`;
};

exports.makeELKrequestFlexExtended = (
  params,
  fieldNames = [],
  fieldValues = [],
  operators = []
) => {
  console.log(
    `makeELKrequestFlexExtended: received request for ELK template request generation` +
      "\n"
  );

  let generateParamsTemplate = () => {
    let base = ``;

    if (params.length > 0) {
      let paramCondition = ``;

      let hasNotDateParams = false;

      const checkTypeOfParams = () => {
        params.forEach((param, i) => {
          if (param) {
            if (!Date.parse(param)) {
              hasNotDateParams = true;
            } else if (param.split("T")[0].length < 10) {
              hasNotDateParams = true;
            }

            if (i == params.length - 1) {
              hasNotDateParams = hasNotDateParams ? true : false;
            }
          } else if (i == params.length - 1) {
            hasNotDateParams = hasNotDateParams ? true : false;
          }
        });
      };

      params.forEach((param, i) => {
        if (param) {
          //console.log(`makeELKrequestFlexExtended: 1st condition param ? = true, param: ${param}, index: ${i}`+'\n');

          if (!Date.parse(param)) {
            //console.log(`makeELKrequestFlexExtended: 2st condition !Date.parse(param) ? = true, param: ${param}, index: ${i}`+'\n');

            if (i == params.length - 1) {
              //console.log(`makeELKrequestFlexExtended: 3rd condition i == params.length - 1 ? = true, param: ${param}, index: ${i}`+'\n');

              paramCondition += `{
                  "match_phrase": {
                  "message": "${param}"}
                }`;
            } else {
              //console.log(`makeELKrequestFlexExtended: 3rd condition i == params.length - 1 ? = false, param: ${param}, index: ${i}`+'\n');
              paramCondition += `{
                  "match_phrase": {
                  "message": "${param}"}
                },`;
            }
          } else {
            if (param.split("T")[0].length < 10) {
              if (i == params.length - 1) {
                paramCondition += `{
                        "match_phrase": {
                        "message": "${param}"}
                      }`;
              } else {
                paramCondition += `{
                      "match_phrase": {
                      "message": "${param}"}
                      },`;
              }
            }
          }
        } else if (i == params.length - 1) {
          //console.log(`makeELKrequestFlexExtended: 1st condition param ? = false, param: ${param}, index: ${i}`+'\n');

          checkTypeOfParams();

          if (hasNotDateParams) {
            //console.log(`makeELKrequestFlexExtended: condition hasNotDateParams ? = true, param: ${param}, index: ${i}`+'\n');

            paramCondition += `{
                "match_phrase": {
                "message": "${
                  params[i - 1]
                    ? params[i - 1]
                    : params[i - 2]
                    ? params[i - 2]
                    : params[i - 3]
                    ? params[i - 3]
                    : "null"
                }"}
              }`;
          }
        }
      });

      if (paramCondition) {
        base = `{
          "bool": {
            "should": [
              ${paramCondition}
            ],
            "minimum_should_match": 1
          }
        },`;
      }
    }

    return base;
  };

  let generateTimeRangeTemplate = () => {
    if (params[2] && params[3]) {
      if (Date.parse(params[2]) && Date.parse(params[3])) {
        return `{
          "range": {
            "@timestamp": {
              "gte": "${params[2]}",
              "lte": "${params[3]}",
              "format": "strict_date_optional_time"
            }
          }
        }`;
      } else {
        let now = new Date();
        let start = now.setMinutes(now.getMinutes() - 3);
        let end = now.setMinutes(now.getMinutes() + 1);
        start = new Date(start).toISOString();
        end = new Date(end).toISOString();

        return `{
          "range": {
            "@timestamp": {
              "gte": "${start}",
              "lte": "${end}",
              "format": "strict_date_optional_time"
            }
          }
        }`;
      }
    } else {
      let now = new Date();
      let start = now.setMinutes(now.getMinutes() - 3);
      let end = now.setMinutes(now.getMinutes() + 1);
      start = new Date(start).toISOString();
      end = new Date(end).toISOString();

      return `{
        "range": {
          "@timestamp": {
            "gte": "${start}",
            "lte": "${end}",
            "format": "strict_date_optional_time"
          }
        }
      }`;
    }
  };

  let generateFildsConditionsTemplate = () => {
    let base = ``;
    let fieldsConditionTemplate = ``;
    let fieldsAndConditionTemplate = ``;
    let isBoolAndOperator = false;

    if (fieldNames.length > 0 && fieldNames.length == fieldValues.length) {
      if (operators.length == 0) {
        fieldNames.forEach((fieldName, i) => {
          if (fieldName) {
            if (i == fieldNames.length - 1) {
              fieldsConditionTemplate += `{
                "match_phrase": {
                "${fieldName}": "${fieldValues[i]}"}
              }`;
            } else {
              fieldsConditionTemplate += `{
                "match_phrase": {
                "${fieldName}": "${fieldValues[i]}"}
              },`;
            }
          }
        });
      } else {
        operators.forEach((operator, i) => {
          if (operator == "AND") {
            isBoolAndOperator = true;

            fieldsAndConditionTemplate += `{"bool": {
              "should": [
                {
                  "match_phrase": {
                  "${fieldNames[i]}": "${fieldValues[i]}"}
                }
              ],
              "minimum_should_match": 1
              }
            },`;
          } else {
            if (i == fieldNames.length - 1) {
              fieldsConditionTemplate += `{
                    "match_phrase": {
                    "${fieldNames[i]}": "${fieldValues[i]}"}
                  }`;
            } else if (operators[i + 1] == "AND") {
              fieldsConditionTemplate += `{
                    "match_phrase": {
                    "${fieldNames[i]}": "${fieldValues[i]}"}
                  }`;
            } else {
              fieldsConditionTemplate += `{
                      "match_phrase": {
                      "${fieldNames[i]}": "${fieldValues[i]}"}
                      },`;
            }
          }
        });
      }
    }

    if (!isBoolAndOperator) {
      return (base = `{
        "bool": {
          "should": [
            ${fieldsConditionTemplate}
          ],
          "minimum_should_match": 1
        }
      },`);
    } else {
      return (base = `{
        "bool": {
          "should": [
            ${fieldsConditionTemplate}
          ],
          "minimum_should_match": 1
        }
      },
      ${fieldsAndConditionTemplate}`);
    }
  };

  let generateHeadTemplate = () => {
    return `{
      "version": true,
      "size": 500,
      "sort": [
        {
          "@timestamp": {
            "order": "desc",
            "unmapped_type": "boolean"
          }
        }
      ],
      "aggs": {
        "2": {
          "date_histogram": {
            "field": "@timestamp",
            "fixed_interval": "1s",
            "time_zone": "Europe/Moscow",
            "min_doc_count": 1
          }
        }
      },
      "stored_fields": [
        "*"
      ],
      "script_fields": {},
      "docvalue_fields": [
        {
          "field": "@timestamp",
          "format": "date_time"
        },
        {
          "field": "timestamp",
          "format": "date_time"
        }
      ],
      "_source": {
        "excludes": []
      },
      "query": {
        "bool": {
          "must": [],
          `;
  };

  let generateTailTemplate = () => {
    // {
    //   "match_phrase": {
    //     "app_name": "testservice"
    //   }
    // },

    return `],
    "should": [],
    "must_not": [
      {
        "match_phrase": {
          "app_name": "testservice"
        }
      },
      {
        "match_phrase": {
          "app_name": "testservice"
        }
      },
      {
        "match_phrase": {
          "app_name": "testservice"
        }
      }
    ]
  }
}
}`;
  };

  let aggregateMainTemplate = () => {
    let baseMainTemplate = ``;

    baseMainTemplate = `${generateHeadTemplate()}
      "filter": [
        {
          "match_all": {}
        },
        ${generateParamsTemplate()}
        ${generateFildsConditionsTemplate()}    
        ${generateTimeRangeTemplate()}
        ${generateTailTemplate()}
      `;

    console.log(
      `makeELKrequestFlexExtended.aggregateMainTemplate: template has been generated: ` +
        "\n"
    );
    return baseMainTemplate;
  };

  return aggregateMainTemplate();
};

exports.makeELKrequestFlexExtendedOpt = (request = {}) => {
  console.log(
    `makeELKrequestFlexExtendedOpt: received request for ELK template request generation` +
      "\n"
  );

  const {
    mainParameters,
    fieldNames,
    fieldValues,
    operators,
    excludeFieldNames,
    excludes,
  } = request;

  let generateParamsTemplate = () => {
    let base = ``;

    if (mainParameters.length > 0) {
      let paramCondition = ``;

      mainParameters.forEach((param, i) => {
        if (param) {
          if (i != 2 && i != 3) {
            if (i == mainParameters.length - 1) {
              paramCondition += `{
                "match_phrase": {
                "message": "${param}"}
              }`;
            } else {
              paramCondition += `{
                "match_phrase": {
                "message": "${param}"}
              },`;
            }
          }
        } else if (i == mainParameters.length - 1) {
          if (paramCondition.lastIndexOf(",") != -1) {
            const idx = paramCondition.lastIndexOf(",");
            paramCondition = paramCondition.slice(0, idx);
          } else {
            paramCondition += ``;
          }

          // `{
          //   "match_phrase": {
          //   "message": "${params[i-1] ? params[i-1] : params[i-2] ? params[i-2] : params[i-3] ? params[i-3] : 'null'}"}
          // }`;
        }
      });

      if (paramCondition) {
        base = `{
          "bool": {
            "should": [
              ${paramCondition}
            ],
            "minimum_should_match": 1
          }
        },`;
      }
    }

    return base;
  };

  let generateTimeRangeTemplate = () => {
    if (mainParameters[2] && mainParameters[3]) {
      if (Date.parse(mainParameters[2]) && Date.parse(mainParameters[3])) {
        return `{
          "range": {
            "@timestamp": {
              "gte": "${mainParameters[2]}",
              "lte": "${mainParameters[3]}",
              "format": "strict_date_optional_time"
            }
          }
        }`;
      } else {
        let now = new Date();
        let start = now.setMinutes(now.getMinutes() - 3);
        let end = now.setMinutes(now.getMinutes() + 1);
        start = new Date(start).toISOString();
        end = new Date(end).toISOString();

        return `{
          "range": {
            "@timestamp": {
              "gte": "${start}",
              "lte": "${end}",
              "format": "strict_date_optional_time"
            }
          }
        }`;
      }
    } else {
      let now = new Date();
      let start = now.setMinutes(now.getMinutes() - 1);
      let end = now.setMinutes(now.getMinutes() + 1);
      start = new Date(start).toISOString();
      end = new Date(end).toISOString();

      return `{
        "range": {
          "@timestamp": {
            "gte": "${start}",
            "lte": "${end}",
            "format": "strict_date_optional_time"
          }
        }
      }`;
    }
  };

  let generateFildsConditionsTemplate = () => {
    let base = ``;
    let fieldsConditionTemplate = ``;
    let fieldsAndConditionTemplate = ``;
    let isBoolAndOperator = false;

    if (fieldNames.length > 0 && fieldNames.length == fieldValues.length) {
      fieldNames.forEach((fieldName, i) => {
        if (fieldName) {
          if (operators[0] != "AND") {
            if (i == fieldNames.length - 1) {
              fieldsConditionTemplate += `{
                  "match_phrase": {
                  "${fieldName}": "${fieldValues[i]}"}
                }`;
            } else {
              fieldsConditionTemplate += `{
                    "match_phrase": {
                    "${fieldName}": "${fieldValues[i]}"}
                  },`;
            }
          } else {
            isBoolAndOperator = true;
            fieldsAndConditionTemplate += `{"bool": {
                "should": [
                  {
                    "match_phrase": {
                    "${fieldNames[i]}": "${fieldValues[i]}"}
                  }
                ],
                "minimum_should_match": 1
                }
              },`;
          }
        }
      });
    }

    if (!isBoolAndOperator) {
      return (base = `{
        "bool": {
          "should": [
            ${fieldsConditionTemplate}
          ],
          "minimum_should_match": 1
        }
      },`);
    } else {
      return (base = fieldsAndConditionTemplate);
    }
  };

  let generateHeadTemplate = () => {
    return `{
      "version": true,
      "size": 500,
      "sort": [
        {
          "@timestamp": {
            "order": "desc",
            "unmapped_type": "boolean"
          }
        }
      ],
      "aggs": {
        "2": {
          "date_histogram": {
            "field": "@timestamp",
            "fixed_interval": "1s",
            "time_zone": "Europe/Moscow",
            "min_doc_count": 1
          }
        }
      },
      "stored_fields": [
        "*"
      ],
      "script_fields": {},
      "docvalue_fields": [
        {
          "field": "@timestamp",
          "format": "date_time"
        },
        {
          "field": "timestamp",
          "format": "date_time"
        }
      ],
      "_source": {
        "excludes": []
      },
      "query": {
        "bool": {
          "must": [],
          `;
  };

  let generateTailTemplate = () => {
    let excludesTemplate = ``;

    if (excludeFieldNames[0] && excludes.length > 0) {
      excludes.forEach((exclude, i) => {
        if (i == excludes.length - 1) {
          excludesTemplate += `{
            "match_phrase": {
              "${excludeFieldNames[0]}": "${exclude}"
            }
          }`;
        } else {
          excludesTemplate += `{
            "match_phrase": {
              "${excludeFieldNames[0]}": "${exclude}"
            }
          },`;
        }
      });
    }

    // {
    //   "match_phrase": {
    //     "app_name": "testservice"
    //   }
    // },

    return `],
    "should": [],
    "must_not": [
      ${excludesTemplate}
    ]
  }
}
}`;
  };

  let aggregateMainTemplate = () => {
    let baseMainTemplate = ``;

    baseMainTemplate = `${generateHeadTemplate()}
      "filter": [
        {
          "match_all": {}
        },
        ${generateParamsTemplate()}
        ${generateFildsConditionsTemplate()}    
        ${generateTimeRangeTemplate()}
        ${generateTailTemplate()}
      `;

    console.log(
      `makeELKrequestFlexExtended.aggregateMainTemplate: template has been generated: ` +
        "\n"
    );
    return baseMainTemplate;
  };

  return aggregateMainTemplate();
};
