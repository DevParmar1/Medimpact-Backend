const _ = require('lodash');

function storeOnly(req, res, next) {
    const accountType = _.get(req, "accountType");
    let isAllowed = false

     if (req.originalUrl.match('/store')) {
        isAllowed = accountType==="Store"?true:false
    }

    if (isAllowed) {
        next();
    } else {
        console.error({ error: "Forbidden error." }, "Forbidden error in userRestrict.");
        res.status(403).json({ message: "Store Priviliges required" });
    }
  }

  module.exports = storeOnly;