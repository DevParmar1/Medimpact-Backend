const routes = require("express").Router();
const {
	Login,
    Register,
	verify
} = require("../Controllers/Auth/AuthController");

routes.get(
	"/verify/:token",
	 verify
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