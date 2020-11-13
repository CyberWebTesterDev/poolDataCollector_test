module.exports = (req, res, next) => {
  res.locals.userSessionData = {
    isAuthenticationNeeded: req.session.isAuthenticated ? !req.session.isAuthenticated : true,
    sessionId: req.sessionID,
    sessionStarted: req.session.sessionStarted,
    remoteIPAddress: req.session.remoteIPAddress,
    userName: req.session.userName
  };

  next();
};
