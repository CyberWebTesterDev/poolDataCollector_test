const EventEmitter = require("events");

const emitter = new EventEmitter();

exports.emitter = emitter;

exports.kbnCookie = ``;

emitter.on("kbn-cookie-received", cookie => {
  console.log(`EventEmitter: event kbn-cookie-received has been emitted. Data: ` + "\n");
  console.log(cookie);
  kbnCookie = cookie;
  console.log(`EventEmitter: kbnCookie: ` + "\n");
  console.log(kbnCookie);
});
