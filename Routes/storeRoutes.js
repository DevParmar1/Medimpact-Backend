const routes = require("express").Router();
const {addMedicines, nearestStore} = require("../Controllers/Store/StoreController");
const {authMiddleware} = require("../Middleware/Auth")
const storeOnly = require("../Middleware/storeOnly");

routes.post(
	"/addMedicines",
	authMiddleware,
    storeOnly,
	addMedicines
)

routes.post(
    "/nearestStores",
    nearestStore
)


module.exports = routes;