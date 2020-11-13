exports.processLogsData = elkPayload => {
  if (elkPayload) {
    //console.log(JSON.parse(elkPayload).hits['total']+'\n');
    let total = JSON.parse(elkPayload).hits["total"];

    //console.log(`processLogsData: total: `+'\n');
    //console.log(total);

    if (total && total.value > 0) {
      let hits = JSON.parse(elkPayload).hits["hits"];

      let sources = [];
      let trimmedSource;

      hits.forEach(source => {
        for (let key in source._source) {
          if (
            key == "app_name" ||
            key == "app_instance" ||
            key == "level" ||
            key == "logger_name" ||
            key == "message" ||
            key == "thread_name" ||
            key == "@timestamp" ||
            key == "stack_trace" ||
            key == "message_size"
          ) {
            trimmedSource = { ...trimmedSource, ...{ [key]: source._source[key] } };
          }
        }

        for (let key in source) {
          if (key == "_id" || key == "_index") {
            trimmedSource = { ...trimmedSource, ...{ [key]: source[key] } };
          }
        }

        sources.push(trimmedSource);
      });

      // console.log(`First source: `);
      // console.log(sources[0]);

      return sources;
    } else return [];
  } else return [];
};
