const _ = require('lodash');

function donorOnly(req, res, next) {
    const accountType = _.get(req, "accountType");
    let isAllowed = false

     if (req.originalUrl.match('/donor')) {
        isAllowed = accountType==="DONOR"?true:false
    }

    if (isAllowed) {
        next();
    } else {
        console.error({ error: "Forbidden error." }, "Forbidden error in userRestrict.");
        res.status(403).json({ message: "Donor Priviliges required" });
    }
  }

  module.exports = donorOnly;
