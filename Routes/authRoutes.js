const routes = require("express").Router();
const {
	Login,
    Register,
	addDetails,
	verify
} = require("../Controllers/Auth/AuthController");
const {authMiddleware} = require("../Middleware/Auth")

routes.get(
	"/verify/:token",
	 verify
)
routes.post(
	"/addDetails",
	authMiddleware,
	addDetails
)
routes.post(
	"/register",
	Register,
);
routes.post(
	"/login",
    Login
);

module.exports = routes;