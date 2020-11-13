const https = require("https");
const { emitter } = require("../event-emitter/EventEmitter");

const authELK = async () => {
  const auth = `Basic ${Buffer.from(userName + ":" + password).toString(
    "base64"
  )}`;

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "***.***.rcl.int.***.ru",
        path: `/***/***/login`,
        method: `POST`,
        headers: {
          "Content-type": "application/json;charset=utf-8",
          Authorization: auth,
          "kbn-xsrf": "reporting",
        },
      },
      (res) => {
        console.log(`Sending POST for authorization in ELK`);
        let data = ``;
        console.log(`Status code: ${res.statusCode}`);

        res.on("data", (chunk) => {
          data += chunk;
          console.log(`Receiving data`);
        });

        res.on("end", () => {
          console.log(
            `postHttpsRequestPromise: Received response for auth` + "\n"
          );
          console.log(res.headers);
          if (
            res.headers["content-type"] == "application/json; charset=utf-8"
          ) {
            console.log(JSON.parse(data));
          } else {
            console.log(data);
          }

          resolve(true);
        });
      }
    );

    req.on("error", (err) => {
      console.log(`postHttpsRequestPromise: Error`);
      console.log(err);
      reject(false);
    });

    req.write(data);
    req.end();
  });
};

exports.postHttpsRequestPromise = (data, options) => {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log(`Sending POST request`);
      let data = ``;
      console.log(`Status code: ${res.statusCode}`);

      if (res.statusCode == 400) {
        console.log(`postHttpsRequestPromise: status in not ok` + "\n");
        reject(res.statusCode);
      }

      res.on("data", (chunk) => {
        data += chunk;
        //console.log(`Receiving data`);
      });

      res.on("end", () => {
        console.log(`postHttpsRequestPromise: Received response` + "\n");
        //console.log(res.headers);
        if (res.headers["content-type"] == "application/json; charset=utf-8") {
          // if ( res.headers['set-cookie'] ) {

          //     //console.log(`postHttpsRequestPromise: cookie has been received`);
          //     //emitter.emit('kbn-cookie-received', res.headers['set-cookie']);
          // }
          //console.log(data);

          resolve(data);
        } else {
          //console.log(data);
          resolve(data);
        }
      });
    });

    req.on("error", (err) => {
      console.log(`postHttpsRequestPromise: Error`);
      console.log(err);
      reject(err);
    });

    req.write(data);
    req.end();
  });
};
