const dateTime = require("../datetime");

exports.loggerServer = (message) => {
  dateTime.getCurrentDateTime();
  console.log(`Server: ${message}` + "\n");
};
exports.addHours = () => {
  return (Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + h * 60 * 60 * 1000);
    return this;
  });
};
