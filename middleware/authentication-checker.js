const { loggerServer } = require("../helper/logger");

module.exports = (req, res, next) => {
  const pathSplitted = req.path.split("/");

  if (
    req.path != "/login" &&
    req.path != "/authenticate" &&
    req.path != "/favicon.ico" &&
    req.path != "/elksearch" &&
    pathSplitted[1] != "public"
  ) {
    loggerServer(`Auth Checker: request access to the ${req.path} route.`);
    if (req.session.isAuthenticated) {
      next();
    } else {
      loggerServer(`Auth Checker: Access without authentication ${req.path}`);
      req.session.pathAccessUnauthenticated = req.path;
      res.redirect("/login");
    }
  } else {
    //loggerServer(`Auth Checker: request access to the ${req.path} route. Authentication is not needed`);
    next();
  }
};
