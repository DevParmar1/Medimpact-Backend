const routes = require("express").Router();
const {nearestDonor} = require("../Controllers/Donor/donorController");


routes.post(
    "/nearestDonors",
    nearestDonor
)


module.exports = routes;